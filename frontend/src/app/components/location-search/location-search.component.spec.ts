import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { getTranslocoTestingModule } from '../../testing/transloco-testing.module';
import { WeatherPlace } from '../../models/weather.models';
import { WeatherService } from '../../services/weather.service';
import { LocationSearchComponent } from './location-search.component';

type SearchStatus = 'idle' | 'hint' | 'loading' | 'results' | 'empty' | 'error';

interface SearchHarness {
    searchControl: { setValue(value: string): void };
    suggestions(): WeatherPlace[];
    status(): SearchStatus;
}

describe('LocationSearchComponent', () => {
    const weatherServiceMock = {
        searchPlaces: vi.fn(),
        getForecast: vi.fn()
    };

    const dialogRefMock = {
        close: vi.fn()
    };

    beforeEach(async () => {
        vi.useFakeTimers();
        weatherServiceMock.searchPlaces.mockReset();
        weatherServiceMock.getForecast.mockReset();
        dialogRefMock.close.mockReset();

        await TestBed.configureTestingModule({
            imports: [
                LocationSearchComponent,
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                NoopAnimationsModule,
                getTranslocoTestingModule()
            ],
            providers: [
                { provide: WeatherService, useValue: weatherServiceMock },
                { provide: MatDialogRef, useValue: dialogRefMock }
            ]
        }).compileComponents();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    function getHarness(): SearchHarness {
        const fixture = TestBed.createComponent(LocationSearchComponent);
        fixture.detectChanges();
        return fixture.componentInstance as unknown as SearchHarness;
    }

    it('should query the weather service after debounce when the query is long enough', () => {
        const place = createPlace(1, 'Lyon', 45.764, 4.8357);
        weatherServiceMock.searchPlaces.mockReturnValue(of([place]));
        const harness = getHarness();

        harness.searchControl.setValue('Ly');
        vi.advanceTimersByTime(260);

        expect(weatherServiceMock.searchPlaces).toHaveBeenCalledWith('Ly');
        expect(harness.suggestions()).toEqual([place]);
        expect(harness.status()).toBe('results');
    });

    it('should expose a hint status when the query is shorter than the minimum length', () => {
        const harness = getHarness();

        harness.searchControl.setValue('a');
        vi.advanceTimersByTime(260);

        expect(weatherServiceMock.searchPlaces).not.toHaveBeenCalled();
        expect(harness.suggestions()).toEqual([]);
        expect(harness.status()).toBe('hint');
    });

    it('should switch to empty status when the service returns no results', () => {
        weatherServiceMock.searchPlaces.mockReturnValue(of([]));
        const harness = getHarness();

        harness.searchControl.setValue('Xyz');
        vi.advanceTimersByTime(260);

        expect(harness.status()).toBe('empty');
    });

    it('should switch to error status when the search fails', () => {
        weatherServiceMock.searchPlaces.mockReturnValue(throwError(() => new Error('boom')));
        const harness = getHarness();

        harness.searchControl.setValue('Paris');
        vi.advanceTimersByTime(260);

        expect(harness.status()).toBe('error');
    });
});

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
