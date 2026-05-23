import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';

import { LocationSearchComponent } from './components/location-search/location-search.component';
import { WeatherPlace } from './models/weather.models';
import { ForecastStateService } from './state/forecast-state.service';
import { LocationStateService } from './state/location-state.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatTooltipModule,
    TranslocoPipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly locationState = inject(LocationStateService);
  protected readonly forecastState = inject(ForecastStateService);
  protected readonly menuOpen = signal(false);

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

  protected toggleMenu(): void {
    this.menuOpen.update(v => !v);
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
