import { computed, DestroyRef, inject, Injectable, NgZone, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WeatherPlace } from '../models/weather.models';
import { WeatherService } from '../services/weather.service';
import { geolocationErrorKey, getCurrentPosition } from '../utils/geolocation.util';

export const CURRENT_LOCATION_ID = -1;
const DEFAULT_CITY = 'Paris';

@Injectable({ providedIn: 'root' })
export class LocationStateService {
  private readonly weatherService = inject(WeatherService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);

  private locationRequestId = 0;
  private defaultCityRequestId = 0;

  readonly selectedPlace = signal<WeatherPlace | null>(null);
  readonly locating = signal(false);
  readonly noticeKey = signal<string | null>(null);
  readonly errorKey = signal<string | null>(null);

  readonly isCurrentLocation = computed(() => this.selectedPlace()?.id === CURRENT_LOCATION_ID);
  readonly placeMeta = computed(() => {
    const place = this.selectedPlace();
    return [place?.admin1, place?.country].filter(Boolean).join(' · ');
  });

  selectPlace(place: WeatherPlace): void {
    if (place.latitude === null || place.longitude === null) {
      return;
    }
    this.selectedPlace.set(place);
  }

  detectCurrentLocation(fallbackToDefault = false): void {
    this.defaultCityRequestId++;
    const requestId = ++this.locationRequestId;
    this.locating.set(true);
    this.errorKey.set(null);
    this.noticeKey.set('location.detecting');

    getCurrentPosition(this.ngZone)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (coords) => {
          if (requestId !== this.locationRequestId) {
            return;
          }
          this.locating.set(false);
          this.noticeKey.set(null);
          this.selectPlace(this.buildCurrentLocationPlace(coords.latitude, coords.longitude));
        },
        error: (error: GeolocationPositionError) => {
          if (requestId !== this.locationRequestId) {
            return;
          }
          this.locating.set(false);
          this.noticeKey.set(geolocationErrorKey(error, fallbackToDefault));
          if (fallbackToDefault) {
            this.loadDefaultCity();
          }
        }
      });
  }

  loadDefaultCity(): void {
    const requestId = ++this.defaultCityRequestId;
    this.errorKey.set(null);

    this.weatherService
      .searchPlaces(DEFAULT_CITY)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (places) => {
          if (requestId !== this.defaultCityRequestId) {
            return;
          }
          if (places.length > 0) {
            this.selectPlace(places[0]);
          } else {
            this.errorKey.set('search.no_results');
          }
        },
        error: () => {
          if (requestId !== this.defaultCityRequestId) {
            return;
          }
          this.errorKey.set('search.unavailable');
        }
      });
  }

  applyPickedPlace(place: WeatherPlace): void {
    this.noticeKey.set(null);
    this.selectPlace(place);
  }

  private buildCurrentLocationPlace(latitude: number, longitude: number): WeatherPlace {
    return {
      id: CURRENT_LOCATION_ID,
      name: '',
      admin1: '',
      country: '',
      latitude,
      longitude,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? null
    };
  }
}
