import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

import { DailyPreview, HourlyPreview } from '../../models/weather.models';
import { ForecastStateService } from '../../state/forecast-state.service';
import { weatherIcon, weatherLabelKey } from '../../utils/weather-code.util';

const TREND_HOURS = 12;
const MIN_BAR_LEVEL = 12;
const MIN_RANGE_WIDTH = 8;

interface HourlyTrendPoint extends HourlyPreview {
  hourIndex: number;
  temperatureLevel: number;
  precipitationLevel: number;
}

interface DailyOverview extends DailyPreview {
  rangeStart: number;
  rangeWidth: number;
}

@Component({
  selector: 'app-forecast-overview',
  imports: [DatePipe, DecimalPipe, MatIconModule, TranslocoModule],
  templateUrl: './forecast-overview.component.html',
  styleUrl: './forecast-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForecastOverviewComponent {
  private readonly forecastState = inject(ForecastStateService);

  protected readonly effectiveIndex = this.forecastState.effectiveHourIndex;
  protected readonly hasForecast = computed(() => this.forecastState.forecast() !== null);

  protected readonly hourlyTrend = computed<HourlyTrendPoint[]>(() => {
    const hourly = this.forecastState.hourlyPreview();
    if (hourly.length === 0) {
      return [];
    }

    const startIndex = Math.min(this.effectiveIndex(), Math.max(0, hourly.length - 1));
    const window = hourly.slice(startIndex, startIndex + TREND_HOURS);
    const temperatures = window.map((point) => point.temperature);
    const minTemperature = Math.min(...temperatures);
    const maxTemperature = Math.max(...temperatures);
    const temperatureSpan = Math.max(1, maxTemperature - minTemperature);

    return window.map((point, index) => ({
      ...point,
      hourIndex: startIndex + index,
      temperatureLevel: this.scale(point.temperature, minTemperature, temperatureSpan, MIN_BAR_LEVEL, 100),
      precipitationLevel: Math.max(4, Math.min(100, point.precipitationProbability))
    }));
  });

  protected readonly dailyOverview = computed<DailyOverview[]>(() => {
    const daily = this.forecastState.dailyPreview().slice(0, 7);
    if (daily.length === 0) {
      return [];
    }

    const minimums = daily.map((day) => day.min);
    const maximums = daily.map((day) => day.max);
    const globalMin = Math.min(...minimums);
    const globalMax = Math.max(...maximums);
    const span = Math.max(1, globalMax - globalMin);

    return daily.map((day) => {
      const rangeStart = this.scale(day.min, globalMin, span, 0, 100);
      const naturalWidth = Math.round(((day.max - day.min) / span) * 100);
      const rangeWidth = Math.min(100 - rangeStart, Math.max(MIN_RANGE_WIDTH, naturalWidth));

      return {
        ...day,
        rangeStart,
        rangeWidth
      };
    });
  });

  protected selectHour(point: HourlyTrendPoint): void {
    this.forecastState.selectHour(point.hourIndex);
  }

  protected trendKey(point: HourlyTrendPoint): string {
    return point.time;
  }

  protected dayKey(day: DailyOverview): string {
    return day.time;
  }

  protected icon(code: number | undefined): string {
    return weatherIcon(code);
  }

  protected labelKey(code: number | undefined): string {
    return weatherLabelKey(code);
  }

  protected isSelected(point: HourlyTrendPoint): boolean {
    return point.hourIndex === this.effectiveIndex();
  }

  private scale(value: number, min: number, span: number, outputMin: number, outputMax: number): number {
    const ratio = (value - min) / span;
    return Math.round(outputMin + ratio * (outputMax - outputMin));
  }
}
