import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { App } from './app';
import { WeatherForecast } from './models/weather.models';
import { WeatherService } from './services/weather.service';
import { getTranslocoTestingModule } from './testing/transloco-testing.module';

describe('App', () => {
    const weatherServiceMock = {
        searchPlaces: vi.fn(),
        getForecast: vi.fn()
    };

    function createForecast(): WeatherForecast {
        return {
            latitude: 45,
            longitude: 4,
            timezone: 'Europe/Paris',
            utc_offset_seconds: 7200,
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
                App,
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

    it('opens the search dialog when openSearch is invoked', () => {
        const fixture = TestBed.createComponent(App);
        const dialog = TestBed.inject(MatDialog);
        const dialogRef = { afterClosed: () => of(null) } as unknown as MatDialogRef<unknown, unknown>;
        const openSpy = vi.spyOn(dialog, 'open').mockReturnValue(dialogRef as never);

        fixture.detectChanges();
        (fixture.componentInstance as unknown as { openSearch: () => void }).openSearch();

        expect(openSpy).toHaveBeenCalled();
    });
});
