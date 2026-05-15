import { weatherIcon, weatherLabelKey } from './weather-code.util';

describe('weather-code.util', () => {
    it('maps clear sky', () => {
        expect(weatherLabelKey(0)).toBe('weather.clear');
        expect(weatherIcon(0)).toBe('wb_sunny');
    });

    it('maps variable cloud cover', () => {
        expect(weatherLabelKey(2)).toBe('weather.variable');
        expect(weatherIcon(2)).toBe('filter_drama');
    });

    it('maps rain', () => {
        expect(weatherLabelKey(63)).toBe('weather.rainy');
        expect(weatherIcon(63)).toBe('grain');
    });

    it('maps snow', () => {
        expect(weatherLabelKey(75)).toBe('weather.snowy');
        expect(weatherIcon(75)).toBe('ac_unit');
    });

    it('maps storms', () => {
        expect(weatherLabelKey(96)).toBe('weather.storm');
        expect(weatherIcon(96)).toBe('flash_on');
    });

    it('maps fog', () => {
        expect(weatherLabelKey(45)).toBe('weather.fog');
        expect(weatherIcon(45)).toBe('blur_on');
    });

    it('falls back to cloudy', () => {
        expect(weatherLabelKey(999)).toBe('weather.cloudy');
        expect(weatherIcon(999)).toBe('cloud');
    });

    it('returns invalid label when code is missing', () => {
        expect(weatherLabelKey(undefined)).toBe('weather.invalid');
    });
});
