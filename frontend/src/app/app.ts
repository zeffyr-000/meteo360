import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';

import { CurrentConditionsComponent } from './components/current-conditions/current-conditions.component';
import { ForecastOverviewComponent } from './components/forecast-overview/forecast-overview.component';
import { LocationSearchComponent } from './components/location-search/location-search.component';
import { WeatherTimelineComponent } from './components/weather-timeline/weather-timeline.component';
import { WeatherPlace } from './models/weather.models';
import { ForecastStateService } from './state/forecast-state.service';
import { LocationStateService } from './state/location-state.service';

@Component({
  selector: 'app-root',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslocoModule,
    CurrentConditionsComponent,
    ForecastOverviewComponent,
    WeatherTimelineComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly locationState = inject(LocationStateService);
  protected readonly forecastState = inject(ForecastStateService);

  constructor() {
    effect(() => {
      const place = this.locationState.selectedPlace();
      if (place) {
        this.forecastState.loadForecast(place);
      }
    });
  }

  ngOnInit(): void {
    this.locationState.detectCurrentLocation(true);
  }

  protected openSearch(): void {
    const dialogRef = this.dialog.open<LocationSearchComponent, void, WeatherPlace | null>(LocationSearchComponent, {
      panelClass: 'location-search-dialog',
      autoFocus: 'first-tabbable',
      restoreFocus: true
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((place) => {
        if (place) {
          this.locationState.applyPickedPlace(place);
        }
      });
  }

  protected refresh(): void {
    const place = this.locationState.selectedPlace();
    if (place) {
      this.forecastState.loadForecast(place);
    } else {
      this.locationState.detectCurrentLocation(true);
    }
  }
}
