import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { WeatherPlace, WeatherForecast } from '../models/weather.models';
import { WeatherService } from '../services/weather.service';
import { ForecastStateService } from './forecast-state.service';

describe('ForecastStateService', () => {
    const weatherServiceMock = {
        searchPlaces: vi.fn(),
        getForecast: vi.fn()
    };

    function buildForecast(currentTime: string, hourlyTimes: string[], dailyDays: string[] = []): WeatherForecast {
        return {
            latitude: 0,
            longitude: 0,
            timezone: 'UTC',
            utc_offset_seconds: 0,
            current: {
                time: currentTime,
                temperature_2m: 20,
                relative_humidity_2m: 50,
                apparent_temperature: 20,
                is_day: 1,
                precipitation: 0,
                weather_code: 0,
                cloud_cover: 0,
                wind_speed_10m: 10,
                wind_direction_10m: 0
            },
            hourly: {
                time: hourlyTimes,
                temperature_2m: hourlyTimes.map(() => 20),
                precipitation_probability: hourlyTimes.map(() => 0),
                weather_code: hourlyTimes.map(() => 0),
                wind_speed_10m: hourlyTimes.map(() => 5)
            },
            daily: dailyDays.length > 0 ? {
                time: dailyDays,
                weather_code: dailyDays.map(() => 0),
                temperature_2m_max: dailyDays.map(() => 25),
                temperature_2m_min: dailyDays.map(() => 12),
                precipitation_sum: dailyDays.map(() => 0),
                wind_speed_10m_max: dailyDays.map(() => 10)
            } : null,
            units: { current: {}, hourly: {}, daily: {} }
        };
    }

    beforeEach(() => {
        weatherServiceMock.searchPlaces.mockReset();
        weatherServiceMock.getForecast.mockReset();

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: WeatherService, useValue: weatherServiceMock }
            ]
        });
    });

    const place: WeatherPlace = {
        id: 1, name: 'P', country: 'C', admin1: '', latitude: 1, longitude: 2, timezone: null
    };

    it('computes the index closest to the current time', () => {
        weatherServiceMock.getForecast.mockReturnValue(of(buildForecast(
            '2026-05-15T13:00',
            ['2026-05-15T11:00', '2026-05-15T12:00', '2026-05-15T13:00', '2026-05-15T14:00']
        )));
        const state = TestBed.inject(ForecastStateService);
        state.loadForecast(place);
        expect(state.nowHourIndex()).toBe(2);
    });

    it('exits live mode on selectHour and returns to it on resetToNow', () => {
        weatherServiceMock.getForecast.mockReturnValue(of(buildForecast(
            '2026-05-15T12:00',
            ['2026-05-15T12:00', '2026-05-15T13:00']
        )));
        const state = TestBed.inject(ForecastStateService);
        state.loadForecast(place);
        state.selectHour(1);
        expect(state.isLive()).toBe(false);
        state.resetToNow();
        expect(state.isLive()).toBe(true);
    });

    it('builds an adaptive timeline (now + hourly today + morning/afternoon for next days + midday for far days)', () => {
        const hours: string[] = [];
        for (let d = 0; d < 5; d++) {
            const day = `2026-05-${(15 + d).toString().padStart(2, '0')}`;
            for (let h = 0; h < 24; h++) {
                hours.push(`${day}T${h.toString().padStart(2, '0')}:00`);
            }
        }
        const dailyDays = ['2026-05-15', '2026-05-16', '2026-05-17', '2026-05-18', '2026-05-19'];
        weatherServiceMock.getForecast.mockReturnValue(of(buildForecast('2026-05-15T10:00', hours, dailyDays)));

        const state = TestBed.inject(ForecastStateService);
        state.loadForecast(place);

        const timeline = state.timeline();
        const kinds = timeline.map((slot) => slot.kind);

        expect(kinds[0]).toBe('now');
        expect(kinds).toContain('morning');
        expect(kinds).toContain('afternoon');
        expect(kinds).toContain('midday');

        const morningSlots = timeline.filter((s) => s.kind === 'morning');
        expect(morningSlots.length).toBe(2);
        expect(morningSlots[0].time).toBe('2026-05-16T09:00');

        const middaySlots = timeline.filter((s) => s.kind === 'midday');
        expect(middaySlots.length).toBeGreaterThanOrEqual(2);
        expect(middaySlots[0].time).toBe('2026-05-18T12:00');
    });

    it('sets errorKey when the forecast call fails', () => {
        weatherServiceMock.getForecast.mockReturnValue(throwError(() => new Error('boom')));
        const state = TestBed.inject(ForecastStateService);
        state.loadForecast(place);
        expect(state.errorKey()).toBe('weather.forecast_unavailable');
    });

    it('maps hourly precipitation (mm) into HourlyPreview when the series is present', () => {
        const forecast = buildForecast('2026-05-15T12:00', ['2026-05-15T12:00', '2026-05-15T13:00']);
        forecast.hourly!.precipitation = [1.5, 0.0];
        weatherServiceMock.getForecast.mockReturnValue(of(forecast));
        const state = TestBed.inject(ForecastStateService);
        state.loadForecast(place);
        const hourly = state.hourlyPreview();
        expect(hourly[0].precipitation).toBe(1.5);
        expect(hourly[1].precipitation).toBe(0.0);
    });

    it('sets HourlyPreview.precipitation to null when the series is absent', () => {
        const forecast = buildForecast('2026-05-15T12:00', ['2026-05-15T12:00']);
        // precipitation is optional — leave it undefined to simulate the absent series
        forecast.hourly!.precipitation = undefined;
        weatherServiceMock.getForecast.mockReturnValue(of(forecast));
        const state = TestBed.inject(ForecastStateService);
        state.loadForecast(place);
        expect(state.hourlyPreview()[0].precipitation).toBeNull();
    });
});
