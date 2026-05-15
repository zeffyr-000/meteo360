import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { DashboardComponent } from './dashboard.component';
import { WeatherPlace, WeatherForecast } from '../../models/weather.models';
import { WeatherService } from '../../services/weather.service';
import { ForecastStateService } from '../../state/forecast-state.service';
import { LocationStateService } from '../../state/location-state.service';
import { getTranslocoTestingModule } from '../../testing/transloco-testing.module';

describe('DashboardComponent', () => {
    const weatherServiceMock = {
        searchPlaces: vi.fn(),
        getForecast: vi.fn()
    };

    function createPlace(): WeatherPlace {
        return {
            id: 1,
            name: 'Lyon',
            admin1: 'Rhône-Alpes',
            country: 'France',
            latitude: 45,
            longitude: 4,
            timezone: 'Europe/Paris'
        };
    }

    function createForecast(): WeatherForecast {
        return {
            latitude: 45,
            longitude: 4,
            timezone: 'Europe/Paris',
            current: {
                time: '2026-05-15T12:00',
                temperature_2m: 22,
                relative_humidity_2m: 60,
                apparent_temperature: 23,
                is_day: 1,
                precipitation: 0,
                weather_code: 1,
                cloud_cover: 30,
                wind_speed_10m: 12,
                wind_direction_10m: 90
            },
            hourly: null,
            daily: null,
            units: { current: {}, hourly: {}, daily: {} }
        };
    }

    beforeEach(async () => {
        weatherServiceMock.searchPlaces.mockReset().mockReturnValue(of([]));
        weatherServiceMock.getForecast.mockReset().mockReturnValue(of(createForecast()));

        await TestBed.configureTestingModule({
            imports: [
                DashboardComponent,
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                NoopAnimationsModule,
                getTranslocoTestingModule()
            ],
            providers: [
                provideRouter([]),
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: WeatherService, useValue: weatherServiceMock }
            ]
        }).compileComponents();
    });

    afterEach(() => vi.clearAllMocks());

    it('loads forecast automatically when a place is selected', () => {
        const fixture = TestBed.createComponent(DashboardComponent);
        fixture.detectChanges();

        const locationState = TestBed.inject(LocationStateService);
        const forecastState = TestBed.inject(ForecastStateService);

        locationState.selectPlace(createPlace());
        fixture.detectChanges();

        expect(weatherServiceMock.getForecast).toHaveBeenCalledWith(45, 4);
        expect(forecastState.forecast()).not.toBeNull();
    });
});
