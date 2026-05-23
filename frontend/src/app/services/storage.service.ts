import { Injectable } from '@angular/core';

import { WeatherPlace } from '../models/weather.models';

/**
 * Discriminated union representing the result of a localStorage read operation.
 */
type StorageResult<T> =
  | { status: 'ok'; value: T }
  | { status: 'missing' }
  | { status: 'error' };

/**
 * Service managing user preferences persistence in localStorage.
 * Handles 3 values: selected place, language, and dark mode preference.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly storageKeyPlace = 'meteo360.selectedPlace';
  private readonly storageKeyLang = 'meteo360.lang';
  private readonly storageKeyDarkMode = 'meteo360.darkMode';

  private readonly defaultLang = 'fr';
  private readonly defaultDarkMode = false;

  constructor() {
    this.initializeDefaults();
  }

  /**
   * Initialize default values if they don't exist.
   */
  private initializeDefaults(): void {
    const lang = this.getItem<string>(this.storageKeyLang);
    if (lang.status === 'missing') {
      this.setLang(this.defaultLang);
    }
    const darkMode = this.getItem<boolean>(this.storageKeyDarkMode);
    if (darkMode.status === 'missing') {
      this.setDarkMode(this.defaultDarkMode);
    }
  }

  /**
   * Store a value in localStorage.
   */
  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
    }
  }

  /**
   * Retrieve a value from localStorage.
   * Returns a discriminated result to distinguish missing keys from parse/access errors.
   */
  private getItem<T>(key: string): StorageResult<T> {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return { status: 'missing' };
      }
      return { status: 'ok', value: JSON.parse(item) as T };
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return { status: 'error' };
    }
  }

  /**
   * Remove a value from localStorage.
   */
  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  }

  // === Public methods for selected place ===

  /**
   * Retrieve the last selected place from localStorage.
   * Returns null (and clears the key) if the stored value is not a valid WeatherPlace.
   */
  getSelectedPlace(): WeatherPlace | null {
    const result = this.getItem<unknown>(this.storageKeyPlace);
    if (result.status === 'error') {
      // Storage unavailable or blocked - don't attempt removeItem
      return null;
    }
    if (result.status === 'missing') {
      return null;
    }
    const value = result.value;
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      this.removeItem(this.storageKeyPlace);
      return null;
    }
    const place = value as Record<string, unknown>;
    const id = place['id'];
    const name = place['name'];
    const country = place['country'];
    const admin1 = place['admin1'];
    const latitude = place['latitude'];
    const longitude = place['longitude'];
    const timezone = place['timezone'];
    const isFiniteNumberOrNull = (v: unknown): v is number | null =>
      v === null || (typeof v === 'number' && Number.isFinite(v));
    const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
    const isStringOrNull = (v: unknown): v is string | null => typeof v === 'string' || v === null;
    if (!isFiniteNumberOrNull(id) || typeof name !== 'string' || typeof country !== 'string' || typeof admin1 !== 'string') {
      this.removeItem(this.storageKeyPlace);
      return null;
    }
    if (!isFiniteNumber(latitude) || !isFiniteNumber(longitude) || !isStringOrNull(timezone)) {
      this.removeItem(this.storageKeyPlace);
      return null;
    }
    return value as WeatherPlace;
  }

  /**
   * Store the selected place in localStorage.
   */
  setSelectedPlace(place: WeatherPlace | null): void {
    if (place === null) {
      this.removeItem(this.storageKeyPlace);
    } else {
      this.setItem(this.storageKeyPlace, place);
    }
  }

  // === Public methods for language ===

  /**
   * Retrieve the language from localStorage.
   * Returns 'fr' by default if not set or if the stored value is invalid.
   */
  getLang(): string {
    const result = this.getItem<unknown>(this.storageKeyLang);
    if (result.status === 'ok' && typeof result.value === 'string') {
      return result.value;
    }
    // Normalize corrupted values (but don't write if storage unavailable)
    if (result.status === 'ok') {
      this.setLang(this.defaultLang);
    }
    return this.defaultLang;
  }

  /**
   * Store the language in localStorage.
   */
  setLang(lang: string): void {
    this.setItem(this.storageKeyLang, lang);
  }

  // === Public methods for dark mode ===

  /**
   * Retrieve the dark mode state from localStorage.
   * Returns false by default if not set or if the stored value is invalid.
   */
  getDarkMode(): boolean {
    const result = this.getItem<unknown>(this.storageKeyDarkMode);
    if (result.status === 'ok' && typeof result.value === 'boolean') {
      return result.value;
    }
    // Normalize corrupted values (but don't write if storage unavailable)
    if (result.status === 'ok') {
      this.setDarkMode(this.defaultDarkMode);
    }
    return this.defaultDarkMode;
  }

  /**
   * Store the dark mode state in localStorage.
   */
  setDarkMode(enabled: boolean): void {
    this.setItem(this.storageKeyDarkMode, enabled);
  }
}
