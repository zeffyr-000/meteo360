import { DecimalPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';

import { RollingNumberComponent } from '../rolling-number/rolling-number.component';
import { WeatherGlyphComponent, type WeatherGlyph } from '../weather-glyph/weather-glyph.component';
import { ForecastStateService } from '../../state/forecast-state.service';
import { LocationStateService } from '../../state/location-state.service';
import { WeatherDaily } from '../../models/weather.models';
import { weatherLabelKey } from '../../utils/weather-code.util';
import { windCardinal } from '../../utils/wind-cardinal.util';

type WeatherMood = 'clear' | 'variable' | 'fog' | 'rainy' | 'snowy' | 'storm' | 'cloudy';

interface UvSummary {
  value: number;
  gaugeValue: number;
  gaugeMax: number;
}

interface SunArc {
  mode: 'day';
  sunrise: Date;
  sunset: Date;
  progress: number;
  dayLengthH: number;
  dayLengthM: number;
}

interface SunNight {
  mode: 'night';
  nextSunrise: Date | null;
  /** True when the next sunrise is still today (pre-dawn); false when it is tomorrow (post-sunset). */
  nextSunriseIsToday: boolean;
}

type SunData = SunArc | SunNight;
const UV_GAUGE_MAX = 10;

/** Converts an Open-Meteo place-local ISO string ("YYYY-MM-DDTHH:mm") into a UTC Date
 * using the place's UTC offset. All Open-Meteo local-time strings must be parsed this way
 * to avoid browser-timezone contamination when comparing sunrise/sunset/current times.
 */
function localIsoToDate(iso: string, utcOffsetSeconds: number): Date {
  return new Date(new Date(iso + 'Z').getTime() - utcOffsetSeconds * 1000);
}

@Component({
  selector: 'app-current-conditions',
  imports: [
    DatePipe,
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TranslocoModule,
    RollingNumberComponent,
    WeatherGlyphComponent
  ],
  templateUrl: './current-conditions.component.html',
  styleUrl: './current-conditions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-period-ready]': 'periodTransitionReady() ? "true" : null',
    '[attr.data-period-phase]': 'periodPhase()'
  }
})
export class CurrentConditionsComponent {
  private readonly forecastState = inject(ForecastStateService);
  private readonly locationState = inject(LocationStateService);

  protected readonly current = this.forecastState.current;
  protected readonly selectedHour = this.forecastState.selectedHour;
  protected readonly isLive = this.forecastState.isLive;
  protected readonly loading = this.forecastState.loading;
  protected readonly selectedPlace = this.locationState.selectedPlace;
  protected readonly isCurrentLocation = this.locationState.isCurrentLocation;
  protected readonly placeMeta = this.locationState.placeMeta;
  protected readonly locating = this.locationState.locating;
  protected readonly periodPhase = signal(0);
  protected readonly periodTransitionReady = signal(false);
  protected readonly uvTicks = Array.from({ length: UV_GAUGE_MAX }, (_, index) => index + 1);
  protected readonly timezone = computed(
    () => this.forecastState.forecast()?.timezone ?? this.selectedPlace()?.timezone ?? null
  );
  private readonly utcOffset = computed<number | null>(
    () => this.forecastState.forecast()?.utc_offset_seconds ?? null
  );

  /** Daily payload (raw arrays from Open-Meteo). */
  private readonly daily = computed<WeatherDaily | null>(() => this.forecastState.forecast()?.daily ?? null);

  /** Index of the displayed day inside the daily payload. In preview mode uses the selected hour's date. */
  private readonly todayDailyIndex = computed<number>(() => {
    const daily = this.daily();
    if (!daily || daily.time.length === 0) {
      return -1;
    }
    const reference = this.displayTime() ?? this.current()?.time ?? new Date().toISOString();
    const day = reference.slice(0, 10);
    const index = daily.time.findIndex((d) => d.startsWith(day));
    return index >= 0 ? index : 0;
  });

  protected readonly weatherCode = computed(() => {
    if (this.isLive()) {
      return this.current()?.weather_code;
    }
    return this.selectedHour()?.weatherCode;
  });

  protected readonly temperature = computed(() => {
    if (this.isLive()) {
      return this.current()?.temperature_2m ?? null;
    }
    return this.selectedHour()?.temperature ?? null;
  });

  protected readonly displayTime = computed(() => {
    if (this.isLive()) {
      return this.current()?.time ?? null;
    }
    return this.selectedHour()?.time ?? null;
  });

  private readonly periodKey = computed(() => this.displayTime() ?? 'empty');

  private lastPeriodKey: string | null = null;

  constructor() {
    effect(() => {
      const nextPeriodKey = this.periodKey();
      if (this.lastPeriodKey === null) {
        this.lastPeriodKey = nextPeriodKey;
        return;
      }
      if (this.lastPeriodKey === 'empty' && nextPeriodKey !== 'empty') {
        this.lastPeriodKey = nextPeriodKey;
        return;
      }
      if (nextPeriodKey !== this.lastPeriodKey) {
        this.lastPeriodKey = nextPeriodKey;
        this.periodTransitionReady.set(true);
        this.periodPhase.update((phase) => (phase + 1) % 2);
      }
    });
  }

  /** Converts an Open-Meteo local-time ISO string to a proper UTC Date for use with DatePipe + timezone. */
  protected toLocalDate(iso: string): Date {
    const offset = this.utcOffset();
    return offset !== null ? localIsoToDate(iso, offset) : new Date(iso);
  }

  protected readonly feelsLike = computed<number | null>(() => {
    if (this.isLive()) {
      return this.current()?.apparent_temperature ?? this.selectedHour()?.apparentTemperature ?? null;
    }
    return this.selectedHour()?.apparentTemperature ?? null;
  });

  protected readonly dailyRange = computed<{ min: number; max: number } | null>(() => {
    const daily = this.daily();
    const i = this.todayDailyIndex();
    if (!daily || i < 0) {
      return null;
    }
    const min = daily.temperature_2m_min[i];
    const max = daily.temperature_2m_max[i];
    if (min === undefined || max === undefined) {
      return null;
    }
    return { min, max };
  });

  protected readonly windSpeed = computed<number | null>(() => {
    if (this.isLive()) {
      return this.current()?.wind_speed_10m ?? null;
    }
    return this.selectedHour()?.windSpeed ?? null;
  });

  protected readonly windDirection = computed<number | null>(() => {
    if (this.isLive()) {
      return this.current()?.wind_direction_10m ?? this.selectedHour()?.windDirection ?? null;
    }
    return this.selectedHour()?.windDirection ?? null;
  });

  protected readonly windCardinalLabel = computed(() => windCardinal(this.windDirection()));

  protected readonly windGusts = computed<number | null>(() => {
    if (this.isLive()) {
      return this.current()?.wind_gusts_10m ?? this.selectedHour()?.windGusts ?? null;
    }
    return this.selectedHour()?.windGusts ?? null;
  });

  protected readonly humidity = computed<number | null>(() => {
    if (this.isLive()) {
      return this.current()?.relative_humidity_2m ?? this.selectedHour()?.humidity ?? null;
    }
    return this.selectedHour()?.humidity ?? null;
  });

  protected readonly uv = computed<UvSummary | null>(() => {
    const raw = this.selectedHour()?.uvIndex;
    if (raw === undefined || raw === null) {
      return null;
    }
    const rounded = Math.round(raw);
    const gaugeValue = Math.max(0, Math.min(UV_GAUGE_MAX, rounded));
    return {
      value: rounded,
      gaugeValue,
      gaugeMax: UV_GAUGE_MAX
    };
  });

  protected readonly precip24h = computed<number | null>(() => {
    const daily = this.daily();
    const i = this.todayDailyIndex();
    if (!daily || i < 0) {
      return null;
    }
    return daily.precipitation_sum[i] ?? null;
  });

  protected readonly sunData = computed<SunData | null>(() => {
    const daily = this.daily();
    const i = this.todayDailyIndex();
    if (!daily || i < 0 || !daily.sunrise || !daily.sunset) {
      return null;
    }
    const sunriseIso = daily.sunrise[i];
    const sunsetIso = daily.sunset[i];
    if (!sunriseIso || !sunsetIso) {
      return null;
    }
    const utcOffset = this.utcOffset();
    const toDate = (iso: string): Date =>
      utcOffset !== null ? localIsoToDate(iso, utcOffset) : new Date(iso);
    const sunrise = toDate(sunriseIso);
    const sunset = toDate(sunsetIso);
    const referenceIso = this.displayTime() ?? this.current()?.time ?? null;
    const now = referenceIso ? toDate(referenceIso) : new Date();
    if (now >= sunrise && now <= sunset) {
      const total = sunset.getTime() - sunrise.getTime();
      const elapsed = now.getTime() - sunrise.getTime();
      const progress = total > 0 ? Math.max(0, Math.min(1, elapsed / total)) : 0;
      const dayLengthMin = Math.round(total / 60000);
      return {
        mode: 'day',
        sunrise,
        sunset,
        progress,
        dayLengthH: Math.floor(dayLengthMin / 60),
        dayLengthM: dayLengthMin % 60
      };
    }
    const isPreDawn = now < sunrise;
    const nextIso = isPreDawn ? daily.sunrise[i] : (daily.sunrise[i + 1] ?? null);
    return {
      mode: 'night',
      nextSunrise: nextIso ? toDate(nextIso) : null,
      nextSunriseIsToday: isPreDawn
    };
  });

  protected readonly weatherMood = computed<WeatherMood>(() => {
    switch (weatherLabelKey(this.weatherCode())) {
      case 'weather.clear':
        return 'clear';
      case 'weather.variable':
        return 'variable';
      case 'weather.fog':
        return 'fog';
      case 'weather.rainy':
        return 'rainy';
      case 'weather.snowy':
        return 'snowy';
      case 'weather.storm':
        return 'storm';
      default:
        return 'cloudy';
    }
  });

  /** Resolves the in-house SVG glyph that replaces Material icons in the headline. */
  protected readonly weatherGlyph = computed<WeatherGlyph>(() => {
    const mood = this.weatherMood();
    const sun = this.sunData();
    const isDay = this.isLive() ? this.current()?.is_day !== 0 : sun?.mode === 'day';
    switch (mood) {
      case 'clear':
        return isDay === false ? 'moon' : 'sun';
      case 'variable':
        return isDay === false ? 'cloud' : 'partly-cloudy';
      case 'cloudy':
        return 'cloud';
      case 'fog':
        return 'fog';
      case 'rainy':
        return 'rain';
      case 'snowy':
        return 'snow';
      case 'storm':
        return 'storm';
      default:
        return 'cloud';
    }
  });

  protected backToNow(): void {
    this.forecastState.resetToNow();
  }

  protected labelKey(code: number | undefined): string {
    return weatherLabelKey(code);
  }
}
