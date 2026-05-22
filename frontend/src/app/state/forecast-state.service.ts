import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  DailyPreview,
  HourlyPreview,
  TimelineSlot,
  WeatherForecast,
  WeatherPlace
} from '../models/weather.models';
import { WeatherService } from '../services/weather.service';

const TODAY_STEP_HOURS = 2;
const MAX_TODAY_SLOTS = 5;
const TWO_SLOT_HORIZON_DAYS = 2;
const MORNING_HOUR = 9;
const AFTERNOON_HOUR = 15;
const MIDDAY_HOUR = 12;

@Injectable({ providedIn: 'root' })
export class ForecastStateService {
  private readonly weatherService = inject(WeatherService);
  private readonly destroyRef = inject(DestroyRef);

  private forecastRequestId = 0;

  readonly forecast = signal<WeatherForecast | null>(null);
  readonly loading = signal(false);
  readonly errorKey = signal<string | null>(null);

  /** null = follow live "now"; a number = user picked a specific hour. */
  readonly selectedHourIndex = signal<number | null>(null);

  readonly current = computed(() => this.forecast()?.current ?? null);

  readonly hourlyPreview = computed<HourlyPreview[]>(() => {
    const hourly = this.forecast()?.hourly;
    if (!hourly) {
      return [];
    }
    return hourly.time.map((time, index) => ({
      time,
      temperature: hourly.temperature_2m[index],
      apparentTemperature: hourly.apparent_temperature?.[index] ?? null,
      humidity: hourly.relative_humidity_2m?.[index] ?? null,
      precipitationProbability: hourly.precipitation_probability[index],
      windSpeed: hourly.wind_speed_10m[index],
      windDirection: hourly.wind_direction_10m?.[index] ?? null,
      windGusts: hourly.wind_gusts_10m?.[index] ?? null,
      weatherCode: hourly.weather_code[index],
      uvIndex: hourly.uv_index?.[index] ?? null
    }));
  });

  readonly dailyPreview = computed<DailyPreview[]>(() => {
    const daily = this.forecast()?.daily;
    if (!daily) {
      return [];
    }
    return daily.time.map((time, index) => ({
      time,
      min: daily.temperature_2m_min[index],
      max: daily.temperature_2m_max[index],
      precipitation: daily.precipitation_sum[index],
      windSpeed: daily.wind_speed_10m_max[index],
      weatherCode: daily.weather_code[index]
    }));
  });

  readonly nowHourIndex = computed(() => {
    const hourly = this.hourlyPreview();
    const current = this.current();
    if (hourly.length === 0) {
      return 0;
    }
    const reference = current ? new Date(current.time).getTime() : Date.now();
    let bestIndex = 0;
    let bestDelta = Number.POSITIVE_INFINITY;
    for (let i = 0; i < hourly.length; i++) {
      const delta = Math.abs(new Date(hourly[i].time).getTime() - reference);
      if (delta < bestDelta) {
        bestDelta = delta;
        bestIndex = i;
      }
    }
    return bestIndex;
  });

  readonly effectiveHourIndex = computed(() => this.selectedHourIndex() ?? this.nowHourIndex());

  readonly selectedHour = computed<HourlyPreview | null>(() => {
    const hourly = this.hourlyPreview();
    if (hourly.length === 0) {
      return null;
    }
    return hourly[this.effectiveHourIndex()] ?? null;
  });

  readonly isLive = computed(() => {
    const selected = this.selectedHourIndex();
    return selected === null || selected === this.nowHourIndex();
  });

  /**
   * Adaptive timeline:
   * - Today: "now" + every 2h up to ~5 slots
   * - Next 2 days: morning (~9h) + afternoon (~15h)
   * - Further days: midday (~12h)
   */
  readonly timeline = computed<TimelineSlot[]>(() => {
    const hourly = this.hourlyPreview();
    const daily = this.dailyPreview();
    if (hourly.length === 0) {
      return [];
    }

    const nowIndex = this.nowHourIndex();
    const todayKey = hourly[nowIndex].time.slice(0, 10);
    const slots: TimelineSlot[] = [];

    slots.push(this.buildSlot('now', nowIndex, todayKey, daily));

    // Today: every TODAY_STEP_HOURS hours until end of today
    let added = 0;
    for (let i = nowIndex + TODAY_STEP_HOURS; i < hourly.length && added < MAX_TODAY_SLOTS; i += TODAY_STEP_HOURS) {
      if (hourly[i].time.slice(0, 10) !== todayKey) {
        break;
      }
      slots.push(this.buildSlot('hour', i, todayKey, daily));
      added++;
    }

    // Upcoming days
    const uniqueDays = this.collectUpcomingDays(hourly, todayKey);
    uniqueDays.forEach((dayKey, offset) => {
      if (offset < TWO_SLOT_HORIZON_DAYS) {
        const morning = this.findHourly(hourly, dayKey, MORNING_HOUR);
        const afternoon = this.findHourly(hourly, dayKey, AFTERNOON_HOUR);
        if (morning >= 0) {
          slots.push(this.buildSlot('morning', morning, todayKey, daily));
        }
        if (afternoon >= 0) {
          slots.push(this.buildSlot('afternoon', afternoon, todayKey, daily));
        }
      } else {
        const midday = this.findHourly(hourly, dayKey, MIDDAY_HOUR);
        if (midday >= 0) {
          slots.push(this.buildSlot('midday', midday, todayKey, daily));
        }
      }
    });

    return slots;
  });

  selectHour(index: number | null): void {
    this.selectedHourIndex.set(index);
  }

  resetToNow(): void {
    this.selectedHourIndex.set(null);
  }

  loadForecast(place: WeatherPlace): void {
    if (place.latitude === null || place.longitude === null) {
      return;
    }
    const requestId = ++this.forecastRequestId;
    this.loading.set(true);
    this.errorKey.set(null);
    this.selectedHourIndex.set(null);

    this.weatherService
      .getForecast(place.latitude, place.longitude)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (forecast) => {
          if (requestId !== this.forecastRequestId) {
            return;
          }
          this.forecast.set(forecast);
          this.loading.set(false);
        },
        error: () => {
          if (requestId !== this.forecastRequestId) {
            return;
          }
          this.loading.set(false);
          this.errorKey.set('weather.forecast_unavailable');
        }
      });
  }

  private buildSlot(
    kind: TimelineSlot['kind'],
    hourIndex: number,
    todayKey: string,
    daily: DailyPreview[]
  ): TimelineSlot {
    const hour = this.hourlyPreview()[hourIndex];
    const dayKey = hour.time.slice(0, 10);
    const dailyEntry = daily.find((entry) => entry.time.startsWith(dayKey)) ?? null;
    return {
      hourIndex,
      kind,
      time: hour.time,
      isToday: dayKey === todayKey,
      temperature: hour.temperature,
      dailyMax: dailyEntry?.max ?? null,
      dailyMin: dailyEntry?.min ?? null,
      precipitationProbability: hour.precipitationProbability,
      windSpeed: hour.windSpeed,
      weatherCode: hour.weatherCode
    };
  }

  private collectUpcomingDays(hourly: HourlyPreview[], todayKey: string): string[] {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const entry of hourly) {
      const dayKey = entry.time.slice(0, 10);
      if (dayKey > todayKey && !seen.has(dayKey)) {
        seen.add(dayKey);
        result.push(dayKey);
      }
    }
    return result;
  }

  private findHourly(hourly: HourlyPreview[], dayKey: string, targetHour: number): number {
    let bestIndex = -1;
    let bestDelta = Number.POSITIVE_INFINITY;
    for (let i = 0; i < hourly.length; i++) {
      const time = hourly[i].time;
      if (time.slice(0, 10) !== dayKey) {
        continue;
      }
      const hour = parseInt(time.slice(11, 13), 10);
      const delta = Math.abs(hour - targetHour);
      if (delta < bestDelta) {
        bestDelta = delta;
        bestIndex = i;
      }
    }
    return bestIndex;
  }
}
