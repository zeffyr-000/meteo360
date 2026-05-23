import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { WeatherPlace } from '../models/weather.models';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let getItemSpy: ReturnType<typeof vi.spyOn>;
  let setItemSpy: ReturnType<typeof vi.spyOn>;
  let removeItemSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

    TestBed.configureTestingModule({
      providers: [StorageService]
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('initializes default language to fr if not set', () => {
      getItemSpy.mockReturnValue(null);

      service = TestBed.inject(StorageService);

      expect(setItemSpy).toHaveBeenCalledWith('meteo360.lang', JSON.stringify('fr'));
    });

    it('initializes default dark mode to false if not set', () => {
      getItemSpy.mockReturnValue(null);

      service = TestBed.inject(StorageService);

      expect(setItemSpy).toHaveBeenCalledWith('meteo360.darkMode', JSON.stringify(false));
    });

    it('does not override existing lang value', () => {
      getItemSpy.mockImplementation((key: string) => {
        if (key === 'meteo360.lang') {
          return JSON.stringify('en');
        }
        return null;
      });
      setItemSpy.mockClear();

      service = TestBed.inject(StorageService);

      const calls = setItemSpy.mock.calls.filter((call: unknown[]) => call[0] === 'meteo360.lang');
      expect(calls.length).toBe(0);
    });

    it('does not override existing dark mode value', () => {
      getItemSpy.mockImplementation((key: string) => {
        if (key === 'meteo360.darkMode') {
          return JSON.stringify(true);
        }
        return null;
      });
      setItemSpy.mockClear();

      service = TestBed.inject(StorageService);

      const calls = setItemSpy.mock.calls.filter((call: unknown[]) => call[0] === 'meteo360.darkMode');
      expect(calls.length).toBe(0);
    });
  });

  describe('getSelectedPlace / setSelectedPlace', () => {
    beforeEach(() => {
      getItemSpy.mockReturnValue(null);
      service = TestBed.inject(StorageService);
      setItemSpy.mockClear();
    });

    it('returns null when no place is stored', () => {
      getItemSpy.mockReturnValue(null);

      const result = service.getSelectedPlace();

      expect(result).toBeNull();
      expect(getItemSpy).toHaveBeenCalledWith('meteo360.selectedPlace');
    });

    it('returns stored place when valid data exists', () => {
      const place = createPlace();
      getItemSpy.mockReturnValue(JSON.stringify(place));

      const result = service.getSelectedPlace();

      expect(result).toEqual(place);
      expect(getItemSpy).toHaveBeenCalledWith('meteo360.selectedPlace');
    });

    it('stores place in localStorage', () => {
      const place = createPlace();

      service.setSelectedPlace(place);

      expect(setItemSpy).toHaveBeenCalledWith('meteo360.selectedPlace', JSON.stringify(place));
    });

    it('removes place from localStorage when null is passed', () => {
      service.setSelectedPlace(null);

      expect(removeItemSpy).toHaveBeenCalledWith('meteo360.selectedPlace');
      expect(setItemSpy).not.toHaveBeenCalledWith('meteo360.selectedPlace', expect.anything());
    });

    it('returns null when stored data is invalid JSON', () => {
      getItemSpy.mockReturnValue('invalid json {');
      vi.spyOn(console, 'error').mockImplementation(() => {
        // Suppress error output during test
      });

      const result = service.getSelectedPlace();

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it('handles localStorage quota exceeded error gracefully', () => {
      setItemSpy.mockImplementation(() => { throw new Error('QuotaExceededError'); });
      vi.spyOn(console, 'error').mockImplementation(() => {
        // Suppress error output during test
      });
      const place = createPlace();

      service.setSelectedPlace(place);

      expect(console.error).toHaveBeenCalled();
    });

    it('returns null and clears storage when place is an array', () => {
      getItemSpy.mockReturnValue(JSON.stringify([]));

      const result = service.getSelectedPlace();

      expect(result).toBeNull();
      expect(removeItemSpy).toHaveBeenCalledWith('meteo360.selectedPlace');
    });

    it('returns null and clears storage when place has invalid field types', () => {
      const invalidPlace = {
        ...createPlace(),
        latitude: 'not-a-number',
        longitude: 'not-a-number'
      };
      getItemSpy.mockReturnValue(JSON.stringify(invalidPlace));

      const result = service.getSelectedPlace();

      expect(result).toBeNull();
      expect(removeItemSpy).toHaveBeenCalledWith('meteo360.selectedPlace');
    });

    it('returns null and clears storage when place has missing required fields', () => {
      const incompletePlace = {
        id: 123,
        name: 'Paris'
        // Missing country, admin1, latitude, longitude, timezone
      };
      getItemSpy.mockReturnValue(JSON.stringify(incompletePlace));

      const result = service.getSelectedPlace();

      expect(result).toBeNull();
      expect(removeItemSpy).toHaveBeenCalledWith('meteo360.selectedPlace');
    });
  });

  describe('getLang / setLang', () => {
    beforeEach(() => {
      getItemSpy.mockReturnValue(null);
      service = TestBed.inject(StorageService);
      setItemSpy.mockClear();
    });

    it('returns fr by default when no lang is stored', () => {
      getItemSpy.mockReturnValue(null);

      const result = service.getLang();

      expect(result).toBe('fr');
    });

    it('returns stored lang when it exists', () => {
      getItemSpy.mockReturnValue(JSON.stringify('en'));

      const result = service.getLang();

      expect(result).toBe('en');
      expect(getItemSpy).toHaveBeenCalledWith('meteo360.lang');
    });

    it('stores lang in localStorage', () => {
      service.setLang('en');

      expect(setItemSpy).toHaveBeenCalledWith('meteo360.lang', JSON.stringify('en'));
    });

    it('returns fr when stored data is invalid JSON', () => {
      getItemSpy.mockReturnValue('invalid json');
      vi.spyOn(console, 'error').mockImplementation(() => {
        // Suppress error output during test
      });

      const result = service.getLang();

      expect(result).toBe('fr');
      expect(console.error).toHaveBeenCalled();
    });

    it('falls back to fr and normalizes when stored lang is not a string', () => {
      getItemSpy.mockReturnValue(JSON.stringify(123));

      const result = service.getLang();

      expect(result).toBe('fr');
      expect(setItemSpy).toHaveBeenCalledWith('meteo360.lang', JSON.stringify('fr'));
    });
  });

  describe('getDarkMode / setDarkMode', () => {
    beforeEach(() => {
      getItemSpy.mockReturnValue(null);
      service = TestBed.inject(StorageService);
      setItemSpy.mockClear();
    });

    it('returns false by default when no dark mode is stored', () => {
      getItemSpy.mockReturnValue(null);

      const result = service.getDarkMode();

      expect(result).toBe(false);
    });

    it('returns stored dark mode when it exists', () => {
      getItemSpy.mockReturnValue(JSON.stringify(true));

      const result = service.getDarkMode();

      expect(result).toBe(true);
      expect(getItemSpy).toHaveBeenCalledWith('meteo360.darkMode');
    });

    it('stores dark mode in localStorage', () => {
      service.setDarkMode(true);

      expect(setItemSpy).toHaveBeenCalledWith('meteo360.darkMode', JSON.stringify(true));
    });

    it('returns false when stored data is invalid JSON', () => {
      getItemSpy.mockReturnValue('not a boolean');
      vi.spyOn(console, 'error').mockImplementation(() => {
        // Suppress error output during test
      });

      const result = service.getDarkMode();

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });

    it('falls back to false and normalizes when stored dark mode is not a boolean', () => {
      getItemSpy.mockReturnValue(JSON.stringify('true'));

      const result = service.getDarkMode();

      expect(result).toBe(false);
      expect(setItemSpy).toHaveBeenCalledWith('meteo360.darkMode', JSON.stringify(false));
    });

    it('falls back to false and normalizes when stored dark mode is a number', () => {
      getItemSpy.mockReturnValue(JSON.stringify(0));

      const result = service.getDarkMode();

      expect(result).toBe(false);
      expect(setItemSpy).toHaveBeenCalledWith('meteo360.darkMode', JSON.stringify(false));
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
