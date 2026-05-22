import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { WeatherForecast, WeatherPlace } from '../models/weather.models';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
    let service: WeatherService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WeatherService, provideHttpClient(), provideHttpClientTesting()]
        });
        service = TestBed.inject(WeatherService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('searches places through the relative API boundary', () => {
        const place = createPlace();
        let result: WeatherPlace[] | undefined;

        service.searchPlaces('Paris').subscribe((places) => {
            result = places;
        });

        const req = httpMock.expectOne((request) =>
            request.url === '/api/places' &&
            request.params.get('q') === 'Paris' &&
            request.params.get('limit') === '5'
        );
        expect(req.request.method).toBe('GET');

        req.flush({ success: true, results: [place] });

        expect(result).toEqual([place]);
    });

    it('uses the requested place search limit', () => {
        service.searchPlaces('Ly', 3).subscribe();

        const req = httpMock.expectOne((request) =>
            request.url === '/api/places' &&
            request.params.get('q') === 'Ly' &&
            request.params.get('limit') === '3'
        );
        expect(req.request.method).toBe('GET');

        req.flush({ success: true, results: [] });
    });

    it('loads forecasts through the relative API boundary', () => {
        const forecast = createForecast();
        let result: WeatherForecast | undefined;

        service.getForecast(48.8566, 2.3522).subscribe((loadedForecast) => {
            result = loadedForecast;
        });

        const req = httpMock.expectOne((request) =>
            request.url === '/api/forecast' &&
            request.params.get('latitude') === '48.8566' &&
            request.params.get('longitude') === '2.3522'
        );
        expect(req.request.method).toBe('GET');

        req.flush({ success: true, forecast });

        expect(result).toEqual(forecast);
    });
});

function createPlace(): WeatherPlace {
    return {
        id: 2988507,
        name: 'Paris',
        country: 'France',
        admin1: 'Ile-de-France',
        latitude: 48.8534,
        longitude: 2.3488,
        timezone: 'Europe/Paris'
    };
}

function createForecast(): WeatherForecast {
    return {
        latitude: 48.8566,
        longitude: 2.3522,
        timezone: 'Europe/Paris',
        utc_offset_seconds: 7200,
        current: {
            time: '2026-05-22T12:00',
            temperature_2m: 21,
            relative_humidity_2m: 48,
            apparent_temperature: 22,
            is_day: 1,
            precipitation: 0,
            weather_code: 0,
            cloud_cover: 12,
            wind_speed_10m: 8,
            wind_direction_10m: 240,
            wind_gusts_10m: 18
        },
        hourly: {
            time: ['2026-05-22T12:00'],
            temperature_2m: [21],
            apparent_temperature: [22],
            relative_humidity_2m: [48],
            precipitation_probability: [5],
            weather_code: [0],
            wind_speed_10m: [8],
            wind_direction_10m: [240],
            wind_gusts_10m: [18],
            uv_index: [6]
        },
        daily: {
            time: ['2026-05-22'],
            weather_code: [0],
            temperature_2m_max: [24],
            temperature_2m_min: [13],
            precipitation_sum: [0],
            wind_speed_10m_max: [18],
            sunrise: ['2026-05-22T06:02'],
            sunset: ['2026-05-22T21:34']
        },
        units: { current: {}, hourly: {}, daily: {} }
    };
}
