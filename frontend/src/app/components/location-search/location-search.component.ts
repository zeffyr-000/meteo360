import { ChangeDetectionStrategy, Component, DestroyRef, inject, NgZone, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoModule } from '@jsverse/transloco';
import { catchError, debounceTime, distinctUntilChanged, filter, of, switchMap, tap } from 'rxjs';

import { WeatherPlace } from '../../models/weather.models';
import { WeatherService } from '../../services/weather.service';
import { CURRENT_LOCATION_ID } from '../../state/location-state.service';
import { GEOLOCATION_OPTIONS } from '../../utils/geolocation.util';

const MIN_QUERY_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 250;

type SearchStatus = 'idle' | 'hint' | 'loading' | 'results' | 'empty' | 'error';

@Component({
  selector: 'app-location-search',
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    TranslocoModule
  ],
  templateUrl: './location-search.component.html',
  styleUrl: './location-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationSearchComponent {
  private readonly weatherService = inject(WeatherService);
  private readonly dialogRef = inject<MatDialogRef<LocationSearchComponent, WeatherPlace | null>>(MatDialogRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);

  protected readonly searchControl = new FormControl<string | WeatherPlace>('', { nonNullable: true });
  protected readonly suggestions = signal<WeatherPlace[]>([]);
  protected readonly status = signal<SearchStatus>('idle');
  protected readonly locating = signal(false);

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        // After selecting an option mat-autocomplete sets the value to the place object: ignore those emissions.
        filter((value): value is string => typeof value === 'string'),
        debounceTime(SEARCH_DEBOUNCE_MS),
        distinctUntilChanged(),
        tap((value) => {
          const query = value.trim();
          if (query.length === 0) {
            this.suggestions.set([]);
            this.status.set('idle');
          } else if (query.length < MIN_QUERY_LENGTH) {
            this.suggestions.set([]);
            this.status.set('hint');
          } else {
            this.status.set('loading');
          }
        }),
        filter((value) => value.trim().length >= MIN_QUERY_LENGTH),
        switchMap((value) =>
          this.weatherService.searchPlaces(value.trim()).pipe(
            catchError(() => {
              this.status.set('error');
              return of<WeatherPlace[] | null>(null);
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((places) => {
        if (places === null) {
          this.suggestions.set([]);
          return;
        }

        this.suggestions.set(places);
        this.status.set(places.length === 0 ? 'empty' : 'results');
      });
  }

  protected displayPlace(place: WeatherPlace | string | null): string {
    if (place && typeof place !== 'string') {
      return place.name;
    }
    return place ?? '';
  }

  protected onSelect(event: MatAutocompleteSelectedEvent): void {
    this.dialogRef.close(event.option.value as WeatherPlace);
  }

  protected detectLocation(): void {
    const geolocation = typeof navigator === 'undefined' ? null : navigator.geolocation;

    if (!geolocation) {
      this.status.set('error');
      return;
    }

    this.locating.set(true);

    geolocation.getCurrentPosition(
      (position) => {
        this.ngZone.run(() => {
          this.locating.set(false);
          this.dialogRef.close({
            id: CURRENT_LOCATION_ID,
            name: '',
            admin1: '',
            country: '',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? null
          });
        });
      },
      () => {
        this.ngZone.run(() => {
          this.locating.set(false);
          this.status.set('error');
        });
      },
      GEOLOCATION_OPTIONS
    );
  }

  protected placeMeta(place: WeatherPlace): string {
    return [place.admin1, place.country].filter(Boolean).join(' · ');
  }

  protected close(): void {
    this.dialogRef.close(null);
  }
}
