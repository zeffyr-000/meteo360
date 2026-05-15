import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';

export const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  maximumAge: 600000,
  timeout: 8000
};

export interface GeolocationCoords {
  latitude: number;
  longitude: number;
}

export function getCurrentPosition(zone: NgZone): Observable<GeolocationCoords> {
  return new Observable<GeolocationCoords>((subscriber) => {
    const geolocation = typeof navigator === 'undefined' ? null : navigator.geolocation;

    if (!geolocation) {
      zone.run(() => {
        subscriber.error({ code: 2, message: 'unavailable' } as GeolocationPositionError);
      });
      return;
    }

    geolocation.getCurrentPosition(
      (position) => {
        zone.run(() => {
          subscriber.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          subscriber.complete();
        });
      },
      (error) => {
        zone.run(() => subscriber.error(error));
      },
      GEOLOCATION_OPTIONS
    );
  });
}

export function geolocationErrorKey(error: GeolocationPositionError, fallbackToDefault: boolean): string {
  if (error.code === 1) {
    return fallbackToDefault ? 'location.denied_fallback' : 'location.denied';
  }
  if (error.code === 3) {
    return fallbackToDefault ? 'location.timeout_fallback' : 'location.timeout';
  }
  return fallbackToDefault ? 'location.unavailable_fallback' : 'location.unavailable';
}
