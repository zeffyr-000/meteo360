import { DecimalPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  signal
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';

import { TimelineSlot } from '../../models/weather.models';
import { ForecastStateService } from '../../state/forecast-state.service';
import { LocationStateService } from '../../state/location-state.service';
import { weatherIcon, weatherLabelKey } from '../../utils/weather-code.util';

interface TimelineGroup {
  dayKey: string;
  /** ISO timestamp of the first slot in the group (used by date pipe). */
  time: string;
  /** Transloco key when the day deserves a relative label, null otherwise. */
  labelKey: string | null;
  slots: TimelineSlot[];
}

interface CurvePoint {
  x: number;
  y: number;
  temperature: number;
}

const CURVE_HEIGHT = 44;
const CURVE_PADDING_Y = 6;
const SCROLL_STEP_RATIO = 0.8;

@Component({
  selector: 'app-weather-timeline',
  imports: [DatePipe, DecimalPipe, MatButtonModule, MatIconModule, MatTooltipModule, TranslocoPipe],
  templateUrl: './weather-timeline.component.html',
  styleUrl: './weather-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'timeline' }
})
export class WeatherTimelineComponent {
  private readonly forecastState = inject(ForecastStateService);
  private readonly locationState = inject(LocationStateService);
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly slots = this.forecastState.timeline;
  protected readonly effectiveIndex = this.forecastState.effectiveHourIndex;
  protected readonly curveHeight = CURVE_HEIGHT;

  protected readonly timezone = computed(
    () => this.forecastState.forecast()?.timezone ?? this.locationState.selectedPlace()?.timezone ?? null
  );

  private readonly utcOffset = computed(
    () => this.forecastState.forecast()?.utc_offset_seconds ?? null
  );

  /** Converts a place-local Open-Meteo ISO string to a UTC Date using the forecast's UTC offset. */
  protected toLocalDate(iso: string): Date {
    const offset = this.utcOffset();
    if (offset === null) {
      return new Date(iso);
    }
    return new Date(new Date(iso + 'Z').getTime() - offset * 1000);
  }

  protected readonly groupedSlots = computed<TimelineGroup[]>(() => {
    const slots = this.slots();
    if (slots.length === 0) {
      return [];
    }
    const todayKey = slots[0].time.slice(0, 10);
    const groups: TimelineGroup[] = [];
    const indexByKey = new Map<string, number>();

    for (const slot of slots) {
      const dayKey = slot.time.slice(0, 10);
      const existing = indexByKey.get(dayKey);
      if (existing !== undefined) {
        groups[existing].slots.push(slot);
        continue;
      }
      const offset = groups.length;
      const labelKey =
        dayKey === todayKey
          ? 'timeline.today'
          : offset === 1
            ? 'timeline.tomorrow'
            : null;
      indexByKey.set(dayKey, offset);
      groups.push({
        dayKey,
        time: slot.time,
        labelKey,
        slots: [slot]
      });
    }
    return groups;
  });

  protected readonly selectedSlotKey = computed(() => {
    const index = this.effectiveIndex();
    const slot = this.slots().find((s) => s.hourIndex === index);
    return slot ? this.slotKey(slot) : null;
  });

  private readonly curvePoints = signal<CurvePoint[]>([]);
  private readonly trackWidth = signal(0);

  protected readonly curveWidth = computed(() => this.trackWidth());
  protected readonly curveViewBox = computed(
    () => `0 0 ${Math.max(1, this.trackWidth())} ${CURVE_HEIGHT}`
  );

  protected readonly curvePath = computed(() => this.buildCurvePath(this.curvePoints()));
  protected readonly curveAreaPath = computed(() => {
    const pts = this.curvePoints();
    const line = this.curvePath();
    if (!line || pts.length === 0) {
      return '';
    }
    const lastX = pts[pts.length - 1].x;
    const firstX = pts[0].x;
    return `${line} L ${lastX} ${CURVE_HEIGHT} L ${firstX} ${CURVE_HEIGHT} Z`;
  });

  protected readonly canScrollPrev = signal(false);
  protected readonly canScrollNext = signal(false);

  constructor() {
    afterRenderEffect(() => {
      // Keep these calls inside the effect so they re-run on data changes.
      this.measureCurve();
      this.updateScrollState();
      this.centerSelectedSlot();
    });

    this.observeViewportResize();
  }

  protected slotKey(slot: TimelineSlot): string {
    return `${slot.kind}-${slot.hourIndex}`;
  }

  protected groupKey(group: TimelineGroup): string {
    return group.dayKey;
  }

  protected select(slot: TimelineSlot): void {
    if (slot.kind === 'now') {
      this.forecastState.resetToNow();
    } else {
      this.forecastState.selectHour(slot.hourIndex);
    }
  }

  protected icon(code: number | undefined): string {
    return weatherIcon(code);
  }

  protected labelKey(code: number | undefined): string {
    return weatherLabelKey(code);
  }

  protected isSelected(slot: TimelineSlot): boolean {
    return slot.hourIndex === this.effectiveIndex();
  }

  protected primaryLabelKey(slot: TimelineSlot): string | null {
    switch (slot.kind) {
      case 'now':
        return 'timeline.now';
      case 'morning':
        return 'timeline.morning';
      case 'afternoon':
        return 'timeline.afternoon';
      default:
        return null;
    }
  }

  protected onStripScroll(): void {
    this.updateScrollState();
  }

  protected scrollPrev(): void {
    this.scrollByRatio(-SCROLL_STEP_RATIO);
  }

  protected scrollNext(): void {
    this.scrollByRatio(SCROLL_STEP_RATIO);
  }

  private scrollByRatio(ratio: number): void {
    const strip = this.host.nativeElement.querySelector<HTMLElement>('.timeline__strip');
    if (!strip) {
      return;
    }
    strip.scrollBy({ left: strip.clientWidth * ratio, behavior: this.scrollBehavior() });
  }

  private centerSelectedSlot(): void {
    const key = this.selectedSlotKey();
    if (!key) {
      return;
    }
    const root = this.host.nativeElement;
    const target = root.querySelector<HTMLElement>(`[data-slot-key="${key}"]`);
    const strip = root.querySelector<HTMLElement>('.timeline__strip');
    if (!target || !strip) {
      return;
    }
    // Use offsetRelativeTo so the scroll position is computed in the strip's
    // scrollable-content coordinate space, consistent with measureCurve().
    const slotLeft = this.offsetRelativeTo(target, strip);
    const offset = slotLeft - strip.clientWidth / 2 + target.clientWidth / 2;
    strip.scrollTo({ left: Math.max(0, offset), behavior: this.scrollBehavior() });
  }

  /** Returns the scroll behavior appropriate for the user's motion preference. */
  private scrollBehavior(): ScrollBehavior {
    return typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'instant'
      : 'smooth';
  }

  private updateScrollState(): void {
    const strip = this.host.nativeElement.querySelector<HTMLElement>('.timeline__strip');
    if (!strip) {
      this.canScrollPrev.set(false);
      this.canScrollNext.set(false);
      return;
    }
    const max = strip.scrollWidth - strip.clientWidth;
    this.canScrollPrev.set(strip.scrollLeft > 2);
    this.canScrollNext.set(strip.scrollLeft < max - 2);
  }

  private measureCurve(): void {
    const slots = this.slots();
    const root = this.host.nativeElement;
    const track = root.querySelector<HTMLElement>('.timeline__track');
    const slotEls = Array.from(root.querySelectorAll<HTMLElement>('.slot'));

    if (!track || slots.length === 0 || slotEls.length !== slots.length) {
      this.curvePoints.set([]);
      this.trackWidth.set(track?.scrollWidth ?? 0);
      return;
    }

    const temperatures = slots.map((s) => s.temperature);
    const minT = Math.min(...temperatures);
    const maxT = Math.max(...temperatures);
    const span = Math.max(1, maxT - minT);
    const usableHeight = CURVE_HEIGHT - CURVE_PADDING_Y * 2;

    // Use offsetLeft traversal to the track element: these are layout-coordinate
    // values independent of the strip's current scrollLeft, so the curve stays
    // aligned with slots even when a smooth-scroll is in progress.
    const points: CurvePoint[] = slotEls.map((el, index) => {
      const x = this.offsetRelativeTo(el, track) + el.offsetWidth / 2;
      const ratio = (slots[index].temperature - minT) / span;
      const y = CURVE_HEIGHT - CURVE_PADDING_Y - ratio * usableHeight;
      return { x, y, temperature: slots[index].temperature };
    });

    this.trackWidth.set(track.scrollWidth);
    this.curvePoints.set(points);
  }

  private buildCurvePath(points: CurvePoint[]): string {
    if (points.length === 0) {
      return '';
    }
    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y}`;
    }
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  /**
   * Returns the X offset of `el` relative to `ancestor` by walking the
   * offsetParent chain. This is scroll-invariant: it reflects layout coordinates
   * regardless of the strip's current scrollLeft, so the curve SVG stays aligned
   * with slot cards even while a smooth-scroll is in progress.
   */
  private offsetRelativeTo(el: HTMLElement, ancestor: HTMLElement): number {
    let x = 0;
    let current: HTMLElement | null = el;
    while (current && current !== ancestor) {
      x += current.offsetLeft;
      current = current.offsetParent as HTMLElement | null;
    }
    return x;
  }

  private observeViewportResize(): void {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(() => {
      this.measureCurve();
      this.updateScrollState();
    });
    observer.observe(this.host.nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}

