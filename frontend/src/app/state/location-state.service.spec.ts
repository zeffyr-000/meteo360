import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { WeatherPlace } from '../models/weather.models';
import { StorageService } from '../services/storage.service';
import { CURRENT_LOCATION_ID, LocationStateService } from './location-state.service';

describe('LocationStateService', () => {
  let service: LocationStateService;
  let storageService: {
    getSelectedPlace: ReturnType<typeof vi.fn>;
    setSelectedPlace: ReturnType<typeof vi.fn>;
    getLang: ReturnType<typeof vi.fn>;
    setLang: ReturnType<typeof vi.fn>;
    getDarkMode: ReturnType<typeof vi.fn>;
    setDarkMode: ReturnType<typeof vi.fn>;
  };
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const storageServiceSpy = {
      getSelectedPlace: vi.fn(),
      setSelectedPlace: vi.fn(),
      getLang: vi.fn(),
      setLang: vi.fn(),
      getDarkMode: vi.fn(),
      setDarkMode: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        LocationStateService,
        { provide: StorageService, useValue: storageServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    storageService = TestBed.inject(StorageService) as unknown as typeof storageServiceSpy;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('initialization', () => {
    it('loads selected place from storage on startup', () => {
      const place = createPlace();
      storageService.getSelectedPlace.mockReturnValue(place);

      service = TestBed.inject(LocationStateService);

      expect(service.selectedPlace()).toEqual(place);
      expect(storageService.getSelectedPlace).toHaveBeenCalled();
    });

    it('starts with no place when storage is empty', () => {
      storageService.getSelectedPlace.mockReturnValue(null);

      service = TestBed.inject(LocationStateService);

      expect(service.selectedPlace()).toBeNull();
    });
  });

  describe('persistence', () => {
    beforeEach(() => {
      storageService.getSelectedPlace.mockReturnValue(null);
      service = TestBed.inject(LocationStateService);
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      TestBed.flushEffects();
      storageService.setSelectedPlace.mockClear();
    });

    it('persists place to storage when selected', () => {
      const place = createPlace();

      service.selectPlace(place);
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      TestBed.flushEffects();

      expect(storageService.setSelectedPlace).toHaveBeenCalledWith(place);
    });

    it('persists null to storage when place is cleared', () => {
      // First set a place
      const place = createPlace();
      service.selectPlace(place);
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      TestBed.flushEffects();
      storageService.setSelectedPlace.mockClear();

      // Then clear it
      service.selectedPlace.set(null);
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      TestBed.flushEffects();

      expect(storageService.setSelectedPlace).toHaveBeenCalledWith(null);
    });

    it('does not persist place with null coordinates', () => {
      const invalidPlace: WeatherPlace = {
        ...createPlace(),
        latitude: null,
        longitude: null
      };

      service.selectPlace(invalidPlace);
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      TestBed.flushEffects();

      expect(service.selectedPlace()).toBeNull();
      // selectPlace returns early without changing state, so effect doesn't run
      expect(storageService.setSelectedPlace).not.toHaveBeenCalled();
    });
  });

  describe('selectPlace', () => {
    beforeEach(() => {
      storageService.getSelectedPlace.mockReturnValue(null);
      service = TestBed.inject(LocationStateService);
    });

    it('selects place with valid coordinates', () => {
      const place = createPlace();

      service.selectPlace(place);

      expect(service.selectedPlace()).toEqual(place);
    });

    it('ignores place with null latitude', () => {
      const place: WeatherPlace = {
        ...createPlace(),
        latitude: null
      };

      service.selectPlace(place);

      expect(service.selectedPlace()).toBeNull();
    });

    it('ignores place with null longitude', () => {
      const place: WeatherPlace = {
        ...createPlace(),
        longitude: null
      };

      service.selectPlace(place);

      expect(service.selectedPlace()).toBeNull();
    });
  });

  describe('isCurrentLocation', () => {
    beforeEach(() => {
      storageService.getSelectedPlace.mockReturnValue(null);
      service = TestBed.inject(LocationStateService);
    });

    it('returns true when place is current location', () => {
      const currentLocation: WeatherPlace = {
        id: CURRENT_LOCATION_ID,
        name: '',
        admin1: '',
        country: '',
        latitude: 48.8566,
        longitude: 2.3522,
        timezone: 'Europe/Paris'
      };

      service.selectPlace(currentLocation);

      expect(service.isCurrentLocation()).toBe(true);
    });

    it('returns false when place is a saved location', () => {
      const place = createPlace();

      service.selectPlace(place);

      expect(service.isCurrentLocation()).toBe(false);
    });

    it('returns false when no place is selected', () => {
      expect(service.isCurrentLocation()).toBe(false);
    });
  });

  describe('placeMeta', () => {
    beforeEach(() => {
      storageService.getSelectedPlace.mockReturnValue(null);
      service = TestBed.inject(LocationStateService);
    });

    it('returns admin1 and country when both are present', () => {
      const place = createPlace();

      service.selectPlace(place);

      expect(service.placeMeta()).toBe('Île-de-France · France');
    });

    it('returns country only when admin1 is empty', () => {
      const place: WeatherPlace = {
        ...createPlace(),
        admin1: ''
      };

      service.selectPlace(place);

      expect(service.placeMeta()).toBe('France');
    });

    it('returns empty string when no place is selected', () => {
      expect(service.placeMeta()).toBe('');
    });
  });

  describe('loadDefaultCity', () => {
    beforeEach(() => {
      storageService.getSelectedPlace.mockReturnValue(null);
      service = TestBed.inject(LocationStateService);
    });

    it('loads Paris as default city', () => {
      const place = createPlace();

      service.loadDefaultCity();

      const req = httpMock.expectOne((request) =>
        request.url === '/api/places' && request.params.get('q') === 'Paris'
      );
      req.flush({ success: true, results: [place] });

      expect(service.selectedPlace()).toEqual(place);
    });

    it('sets error when no results found', () => {
      service.loadDefaultCity();

      const req = httpMock.expectOne((request) =>
        request.url === '/api/places' && request.params.get('q') === 'Paris'
      );
      req.flush({ success: true, results: [] });

      expect(service.errorKey()).toBe('search.no_results');
    });

    it('sets error when API request fails', () => {
      service.loadDefaultCity();

      const req = httpMock.expectOne((request) =>
        request.url === '/api/places' && request.params.get('q') === 'Paris'
      );
      req.error(new ProgressEvent('error'));

      expect(service.errorKey()).toBe('search.unavailable');
    });
  });

  describe('applyPickedPlace', () => {
    beforeEach(() => {
      storageService.getSelectedPlace.mockReturnValue(null);
      service = TestBed.inject(LocationStateService);
    });

    it('clears notice and selects place', () => {
      service.noticeKey.set('location.detecting');
      const place = createPlace();

      service.applyPickedPlace(place);

      expect(service.noticeKey()).toBeNull();
      expect(service.selectedPlace()).toEqual(place);
    });
  });
});

function createPlace(): WeatherPlace {
  return {
    id: 2988507,
    name: 'Paris',
    country: 'France',
    admin1: 'Île-de-France',
    latitude: 48.8534,
    longitude: 2.3488,
    timezone: 'Europe/Paris'
  };
}
