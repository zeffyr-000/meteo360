import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { vi } from 'vitest';

import { App } from './app';
import { WeatherForecast, WeatherPlace } from './models/weather.models';
import { WeatherService } from './services/weather.service';
import { getTranslocoTestingModule } from './testing/transloco-testing.module';

describe('App', () => {
    const weatherServiceMock = {
        searchPlaces: vi.fn(),
        getForecast: vi.fn()
    };

    beforeEach(async () => {
        weatherServiceMock.searchPlaces.mockReset();
        weatherServiceMock.getForecast.mockReset();
        weatherServiceMock.searchPlaces.mockReturnValue(of([]));
        weatherServiceMock.getForecast.mockReturnValue(of(createForecast()));
        Object.defineProperty(navigator, 'geolocation', {
            configurable: true,
            value: undefined
        });

        await TestBed.configureTestingModule({
            imports: [App, getTranslocoTestingModule()],
            providers: [{ provide: WeatherService, useValue: weatherServiceMock }]
        }).compileComponents();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(App);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should render the dashboard title', async () => {
        const fixture = TestBed.createComponent(App);
        fixture.detectChanges();
        await fixture.whenStable();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('h1')?.textContent).toContain('Tableau météo');
    });

    it('should search Paris when geolocation is unavailable', async () => {
        const fixture = TestBed.createComponent(App);

        fixture.detectChanges();
        await fixture.whenStable();

        expect(weatherServiceMock.searchPlaces).toHaveBeenCalledWith('Paris');
    });

    it('should load the forecast from browser geolocation', async () => {
        const position = {
            coords: {
                accuracy: 10,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                latitude: 43.6108,
                longitude: 3.8767,
                speed: null,
                toJSON: () => ({})
            },
            timestamp: Date.now(),
            toJSON: () => ({})
        } satisfies GeolocationPosition;
        const getCurrentPosition = vi.fn((success: PositionCallback) => success(position));
        Object.defineProperty(navigator, 'geolocation', {
            configurable: true,
            value: { getCurrentPosition }
        });
        const fixture = TestBed.createComponent(App);

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(getCurrentPosition).toHaveBeenCalled();
        expect(weatherServiceMock.getForecast).toHaveBeenCalledWith(43.6108, 3.8767);
        expect((fixture.nativeElement as HTMLElement).textContent).toContain('Votre position');
    });

    it('should ignore stale search responses', () => {
        const firstSearch = new Subject<WeatherPlace[]>();
        const secondSearch = new Subject<WeatherPlace[]>();
        const firstPlace = createPlace(1, 'Paris', 48.8566, 2.3522);
        const secondPlace = createPlace(2, 'Lyon', 45.764, 4.8357);
        weatherServiceMock.searchPlaces
            .mockReturnValueOnce(firstSearch.asObservable())
            .mockReturnValueOnce(secondSearch.asObservable());
        const fixture = TestBed.createComponent(App);
        const app = fixture.componentInstance as App;
        const appHarness = app as unknown as {
            searchControl: { setValue(value: string): void };
            searchPlaces(): void;
            places(): WeatherPlace[];
            selectedPlace(): WeatherPlace | null;
        };

        appHarness.searchControl.setValue('Paris');
        appHarness.searchPlaces();
        appHarness.searchControl.setValue('Lyon');
        appHarness.searchPlaces();

        secondSearch.next([secondPlace]);
        secondSearch.complete();
        firstSearch.next([firstPlace]);
        firstSearch.complete();

        expect(appHarness.places()).toEqual([secondPlace]);
        expect(appHarness.selectedPlace()).toEqual(secondPlace);
        expect(weatherServiceMock.getForecast).toHaveBeenCalledTimes(1);
        expect(weatherServiceMock.getForecast).toHaveBeenCalledWith(45.764, 4.8357);
    });

    it('should ignore stale forecast responses', () => {
        const firstForecast = new Subject<WeatherForecast>();
        const secondForecast = new Subject<WeatherForecast>();
        const firstPlace = createPlace(1, 'Paris', 48.8566, 2.3522);
        const secondPlace = createPlace(2, 'Lyon', 45.764, 4.8357);
        weatherServiceMock.getForecast
            .mockReturnValueOnce(firstForecast.asObservable())
            .mockReturnValueOnce(secondForecast.asObservable());
        const fixture = TestBed.createComponent(App);
        const app = fixture.componentInstance as App;
        const appHarness = app as unknown as {
            selectPlace(place: WeatherPlace): void;
            selectedPlace(): WeatherPlace | null;
            forecast(): WeatherForecast | null;
        };
        const secondForecastValue = createForecast(45.764, 4.8357);

        appHarness.selectPlace(firstPlace);
        appHarness.selectPlace(secondPlace);

        secondForecast.next(secondForecastValue);
        secondForecast.complete();
        firstForecast.next(createForecast(48.8566, 2.3522));
        firstForecast.complete();

        expect(appHarness.selectedPlace()).toEqual(secondPlace);
        expect(appHarness.forecast()).toEqual(secondForecastValue);
    });
});

function createForecast(latitude = 43.6108, longitude = 3.8767): WeatherForecast {
    return {
        latitude,
        longitude,
        timezone: 'Europe/Paris',
        current: {
            time: '2026-05-03T12:00',
            temperature_2m: 22,
            relative_humidity_2m: 54,
            apparent_temperature: 22,
            is_day: 1,
            precipitation: 0,
            weather_code: 1,
            cloud_cover: 28,
            wind_speed_10m: 12,
            wind_direction_10m: 180
        },
        hourly: {
            time: [],
            temperature_2m: [],
            precipitation_probability: [],
            weather_code: [],
            wind_speed_10m: []
        },
        daily: {
            time: [],
            weather_code: [],
            temperature_2m_max: [],
            temperature_2m_min: [],
            precipitation_sum: [],
            wind_speed_10m_max: []
        },
        units: {
            current: {},
            hourly: {},
            daily: {}
        }
    };
}

function createPlace(id: number, name: string, latitude: number, longitude: number): WeatherPlace {
    return {
        id,
        name,
        country: 'France',
        admin1: name,
        latitude,
        longitude,
        timezone: 'Europe/Paris'
    };
}
