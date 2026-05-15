import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

import { CurrentConditionsComponent } from '../current-conditions/current-conditions.component';
import { ForecastOverviewComponent } from '../forecast-overview/forecast-overview.component';
import { WeatherTimelineComponent } from '../weather-timeline/weather-timeline.component';
import { ForecastStateService } from '../../state/forecast-state.service';
import { LocationStateService } from '../../state/location-state.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatIconModule,
    TranslocoModule,
    CurrentConditionsComponent,
    ForecastOverviewComponent,
    WeatherTimelineComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
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
    if (!this.locationState.selectedPlace()) {
      this.locationState.detectCurrentLocation(true);
    }
  }
}
