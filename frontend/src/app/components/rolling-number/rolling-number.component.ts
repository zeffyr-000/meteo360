import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input, signal } from '@angular/core';

/**
 * Flipboard-style numeric display.
 * Animates each character (digit, sign, dot) independently when the value changes,
 * mimicking a split-flap board. Designed for the headline temperature value.
 */
@Component({
  selector: 'app-rolling-number',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rolling-number.component.html',
  styleUrl: './rolling-number.component.scss',
  host: {
    class: 'rolling-number',
    '[attr.aria-live]': 'announceChanges() ? "polite" : null'
  }
})
export class RollingNumberComponent {
  readonly value = input<number>(0);
  readonly announceChanges = input(false);

  private readonly _prev = signal<string>('');
  private _animTimer: ReturnType<typeof setTimeout> | null = null;

  /** Stringified current value (rounded to integer for temperature). */
  protected readonly current = computed(() => {
    const v = this.value();
    if (v == null || Number.isNaN(v)) return '—';
    return String(Math.round(v));
  });

  /** Snapshot of the previous value when the current one changed. */
  protected readonly previous = computed(() => this._prev());

  /** Per-character cells aligned right-to-left so newly-added digits push left. */
  protected readonly cells = computed(() => {
    const now = this.current();
    const prev = this.previous();
    const len = Math.max(now.length, prev.length);
    const cells: { now: string; prev: string; changed: boolean; posFromRight: number }[] = [];
    for (let i = 0; i < len; i++) {
      const nowChar = now[now.length - 1 - i] ?? '';
      const prevChar = prev[prev.length - 1 - i] ?? '';
      cells.unshift({
        now: nowChar,
        prev: prevChar,
        changed: nowChar !== prevChar,
        posFromRight: i + 1
      });
    }
    return cells;
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Update _prev only after the flip animation has fully completed.
    // 180ms flip-in + 120ms delay = 300ms total; the 30ms buffer ensures the
    // animation frame has settled before we reset the comparison baseline.
    // Using queueMicrotask would fire before the browser paints, stripping
    // .is-changed before the CSS animation can run.
    effect(() => {
      const v = this.current();
      if (this._animTimer !== null) {
        clearTimeout(this._animTimer);
      }
      this._animTimer = setTimeout(() => {
        this._animTimer = null;
        this._prev.set(v);
      }, 330);
    });

    destroyRef.onDestroy(() => {
      if (this._animTimer !== null) clearTimeout(this._animTimer);
    });
  }
}
