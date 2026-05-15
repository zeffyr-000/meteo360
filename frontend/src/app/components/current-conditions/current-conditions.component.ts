import { DecimalPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';

import { ForecastStateService } from '../../state/forecast-state.service';
import { LocationStateService } from '../../state/location-state.service';
import { weatherIcon, weatherLabelKey } from '../../utils/weather-code.util';

type WeatherMood = 'clear' | 'variable' | 'fog' | 'rainy' | 'snowy' | 'storm' | 'cloudy';

@Component({
  selector: 'app-current-conditions',
  imports: [DatePipe, DecimalPipe, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule, TranslocoModule],
  templateUrl: './current-conditions.component.html',
  styleUrl: './current-conditions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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
  protected readonly timezone = computed(() => this.forecastState.forecast()?.timezone ?? this.selectedPlace()?.timezone ?? null);

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

  protected readonly precipitationLabel = computed(() => {
    if (this.isLive()) {
      const value = this.current()?.precipitation ?? 0;
      return { value, unit: 'mm', precise: true };
    }
    const value = this.selectedHour()?.precipitationProbability ?? 0;
    return { value, unit: '%', precise: false };
  });

  protected readonly windSpeed = computed(() => {
    if (this.isLive()) {
      return this.current()?.wind_speed_10m ?? null;
    }
    return this.selectedHour()?.windSpeed ?? null;
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

  protected backToNow(): void {
    this.forecastState.resetToNow();
  }

  protected labelKey(code: number | undefined): string {
    return weatherLabelKey(code);
  }

  protected icon(code: number | undefined): string {
    return weatherIcon(code);
  }
}
