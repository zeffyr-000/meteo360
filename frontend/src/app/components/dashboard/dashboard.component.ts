import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { CurrentConditionsComponent } from '../current-conditions/current-conditions.component';
import { WeatherTimelineComponent } from '../weather-timeline/weather-timeline.component';
import { ForecastStateService } from '../../state/forecast-state.service';
import { LocationStateService } from '../../state/location-state.service';
import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatIconModule,
    TranslocoPipe,
    CurrentConditionsComponent,
    WeatherTimelineComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  protected readonly locationState = inject(LocationStateService);
  protected readonly forecastState = inject(ForecastStateService);
  private readonly metadataService = inject(MetadataService);
  private readonly transloco = inject(TranslocoService);

  constructor() {
    effect(() => {
      const place = this.locationState.selectedPlace();
      if (place) {
        this.forecastState.loadForecast(place);
      }
    });
  }

  ngOnInit(): void {
    this.metadataService.updatePageMetadata({
      title: this.transloco.translate('nav.home'),
      description: this.transloco.translate('seo.dashboard.description')
    });
    if (!this.locationState.selectedPlace()) {
      this.locationState.detectCurrentLocation(true);
    }
  }
}
