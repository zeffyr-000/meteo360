import { DecimalPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, NgZone, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import { DailyPreview, HourlyPreview, WeatherForecast, WeatherPlace } from './models/weather.models';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  imports: [
    DatePipe,
    DecimalPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TranslocoModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  private readonly weatherService = inject(WeatherService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);
  private readonly translocoService = inject(TranslocoService);
  private readonly defaultCity = 'Paris';
  private readonly currentLocationId = -1;
  private readonly geolocationOptions: PositionOptions = {
    enableHighAccuracy: false,
    maximumAge: 600000,
    timeout: 8000
  };

  private locationRequestId = 0;
  private placeSearchRequestId = 0;
  private forecastRequestId = 0;

  protected readonly searchControl = new FormControl('', { nonNullable: true });
  protected readonly places = signal<WeatherPlace[]>([]);
  protected readonly selectedPlace = signal<WeatherPlace | null>(null);
  protected readonly forecast = signal<WeatherForecast | null>(null);
  protected readonly loadingPlaces = signal(false);
  protected readonly loadingForecast = signal(false);
  protected readonly locatingUser = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly locationNotice = signal<string | null>(null);

  protected readonly current = computed(() => this.forecast()?.current ?? null);
  protected readonly selectedPlaceMeta = computed(() => this.placeMeta(this.selectedPlace()));
  protected readonly dailyPreview = computed<DailyPreview[]>(() => {
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

  protected readonly hourlyPreview = computed<HourlyPreview[]>(() => {
    const hourly = this.forecast()?.hourly;

    if (!hourly) {
      return [];
    }

    return hourly.time.slice(0, 8).map((time, index) => ({
      time,
      temperature: hourly.temperature_2m[index],
      precipitationProbability: hourly.precipitation_probability[index],
      windSpeed: hourly.wind_speed_10m[index],
      weatherCode: hourly.weather_code[index]
    }));
  });

  ngOnInit(): void {
    this.detectCurrentLocation(true);
  }

  protected searchPlaces(): void {
    this.runPlaceSearch(true);
  }

  protected refreshWeather(): void {
    const place = this.selectedPlace();

    if (place?.latitude !== null && place?.latitude !== undefined && place.longitude !== null && place.longitude !== undefined) {
      this.selectPlace(place);
      return;
    }

    if (this.searchControl.value.trim()) {
      this.searchPlaces();
      return;
    }

    this.detectCurrentLocation(true);
  }

  protected detectCurrentLocation(fallbackToDefault = false): void {
    const geolocation = typeof navigator === 'undefined' ? null : navigator.geolocation;

    this.placeSearchRequestId++;
    this.forecastRequestId++;
    this.loadingPlaces.set(false);
    this.loadingForecast.set(false);

    if (!geolocation) {
      this.locatingUser.set(false);
      this.locationNotice.set(fallbackToDefault ? 'location.unavailable_fallback' : 'location.unavailable');

      if (fallbackToDefault) {
        this.searchDefaultCity();
      }

      return;
    }

    const requestId = ++this.locationRequestId;
    this.locatingUser.set(true);
    this.error.set(null);
    this.locationNotice.set('location.detecting');

    geolocation.getCurrentPosition(
      (position) => {
        this.ngZone.run(() => {
          if (requestId !== this.locationRequestId) {
            return;
          }

          this.locatingUser.set(false);
          this.locationNotice.set('location.detected');

          const place = this.currentLocationPlace(position.coords.latitude, position.coords.longitude);
          this.places.set([place]);
          this.selectPlace(place);
        });
      },
      (geolocationError) => {
        this.ngZone.run(() => {
          if (requestId !== this.locationRequestId) {
            return;
          }

          this.locatingUser.set(false);
          this.locationNotice.set(this.locationErrorMessage(geolocationError, fallbackToDefault));

          if (fallbackToDefault) {
            this.searchDefaultCity();
          }
        });
      },
      this.geolocationOptions
    );
  }

  protected placeMeta(place: WeatherPlace | null): string {
    return [place?.admin1, place?.country].filter(Boolean).join(' ');
  }

  private searchDefaultCity(): void {
    this.searchControl.setValue(this.defaultCity);
    this.runPlaceSearch(false);
  }

  private runPlaceSearch(clearLocationNotice: boolean): void {
    const query = this.searchControl.value.trim();

    if (!query) {
      return;
    }

    const requestId = ++this.placeSearchRequestId;
    this.locationRequestId++;
    this.forecastRequestId++;
    this.locatingUser.set(false);
    this.loadingForecast.set(false);
    this.error.set(null);
    if (clearLocationNotice) {
      this.locationNotice.set(null);
    }
    this.loadingPlaces.set(true);

    this.weatherService
      .searchPlaces(query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (places) => {
          if (requestId !== this.placeSearchRequestId) {
            return;
          }

          this.places.set(places);
          this.loadingPlaces.set(false);

          if (places.length > 0) {
            this.selectPlace(places[0]);
          } else {
            this.selectedPlace.set(null);
            this.forecast.set(null);
            this.error.set(this.translocoService.translate('search.no_results'));
          }
        },
        error: () => {
          if (requestId !== this.placeSearchRequestId) {
            return;
          }

          this.loadingPlaces.set(false);
          this.error.set(this.translocoService.translate('search.unavailable'));
        }
      });
  }

  private currentLocationPlace(latitude: number, longitude: number): WeatherPlace {
    return {
      id: this.currentLocationId,
      name: '',
      admin1: '',
      country: '',
      latitude,
      longitude,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? null
    };
  }

  private locationErrorMessage(error: GeolocationPositionError, fallbackToDefault: boolean): string {
    if (error.code === 1) {
      return fallbackToDefault ? 'location.denied_fallback' : 'location.denied';
    }

    if (error.code === 3) {
      return fallbackToDefault ? 'location.timeout_fallback' : 'location.timeout';
    }

    return fallbackToDefault ? 'location.unavailable_fallback' : 'location.unavailable';
  }

  protected selectPlace(place: WeatherPlace): void {
    if (place.latitude === null || place.longitude === null) {
      return;
    }

    const requestId = ++this.forecastRequestId;
    this.selectedPlace.set(place);
    this.loadingForecast.set(true);
    this.error.set(null);

    this.weatherService
      .getForecast(place.latitude, place.longitude)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (forecast) => {
          if (requestId !== this.forecastRequestId) {
            return;
          }

          this.forecast.set(forecast);
          this.loadingForecast.set(false);
        },
        error: () => {
          if (requestId !== this.forecastRequestId) {
            return;
          }

          this.loadingForecast.set(false);
          this.error.set(this.translocoService.translate('weather.forecast_unavailable'));
        }
      });
  }

  protected weatherLabel(code: number | undefined): string {
    if (code === undefined) {
      return this.translocoService.translate('weather.invalid');
    }

    if (code === 0) {
      return this.translocoService.translate('weather.clear');
    }

    if ([1, 2, 3].includes(code)) {
      return this.translocoService.translate('weather.variable');
    }

    if ([45, 48].includes(code)) {
      return this.translocoService.translate('weather.fog');
    }

    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
      return this.translocoService.translate('weather.rainy');
    }

    if ([71, 73, 75, 77, 85, 86].includes(code)) {
      return this.translocoService.translate('weather.snowy');
    }

    if ([95, 96, 99].includes(code)) {
      return this.translocoService.translate('weather.storm');
    }

    return this.translocoService.translate('weather.cloudy');
  }

  protected weatherIcon(code: number | undefined): string {
    if (code === 0) {
      return 'wb_sunny';
    }

    if ([1, 2, 3].includes(code ?? -1)) {
      return 'filter_drama';
    }

    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code ?? -1)) {
      return 'grain';
    }

    if ([71, 73, 75, 77, 85, 86].includes(code ?? -1)) {
      return 'ac_unit';
    }

    if ([95, 96, 99].includes(code ?? -1)) {
      return 'flash_on';
    }

    return 'cloud';
  }
}
