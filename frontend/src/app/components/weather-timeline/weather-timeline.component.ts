import { DecimalPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, afterRenderEffect, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

import { TimelineSlot } from '../../models/weather.models';
import { ForecastStateService } from '../../state/forecast-state.service';
import { weatherIcon, weatherLabelKey } from '../../utils/weather-code.util';

@Component({
  selector: 'app-weather-timeline',
  imports: [DatePipe, DecimalPipe, MatButtonModule, MatIconModule, TranslocoModule],
  templateUrl: './weather-timeline.component.html',
  styleUrl: './weather-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherTimelineComponent {
  private readonly forecastState = inject(ForecastStateService);
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);

  protected readonly slots = this.forecastState.timeline;
  protected readonly effectiveIndex = this.forecastState.effectiveHourIndex;

  protected readonly selectedSlotKey = computed(() => {
    const index = this.effectiveIndex();
    const slot = this.slots().find((s) => s.hourIndex === index);
    return slot ? `${slot.kind}-${slot.hourIndex}` : null;
  });

  constructor() {
    afterRenderEffect(() => {
      const key = this.selectedSlotKey();
      if (!key) {
        return;
      }
      const root = this.host.nativeElement;
      const target = root.querySelector<HTMLElement>(`[data-slot-key="${key}"]`);
      const strip = root.querySelector<HTMLElement>('.timeline__strip');
      if (target && strip) {
        const offset = target.offsetLeft - strip.clientWidth / 2 + target.clientWidth / 2;
        strip.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
      }
    });
  }

  protected slotKey(slot: TimelineSlot): string {
    return `${slot.kind}-${slot.hourIndex}`;
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
}
