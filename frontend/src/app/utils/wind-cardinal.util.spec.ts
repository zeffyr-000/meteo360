import { describe, expect, it } from 'vitest';

import { windCardinal } from './wind-cardinal.util';

describe('windCardinal', () => {
  it('returns null for nullish or NaN input', () => {
    expect(windCardinal(null)).toBeNull();
    expect(windCardinal(undefined)).toBeNull();
    expect(windCardinal(Number.NaN)).toBeNull();
  });

  it('maps cardinal angles to the matching sector', () => {
    expect(windCardinal(0)).toBe('N');
    expect(windCardinal(45)).toBe('NE');
    expect(windCardinal(90)).toBe('E');
    expect(windCardinal(135)).toBe('SE');
    expect(windCardinal(180)).toBe('S');
    expect(windCardinal(225)).toBe('SW');
    expect(windCardinal(270)).toBe('W');
    expect(windCardinal(315)).toBe('NW');
  });

  it('rounds intermediate angles to the nearest sector', () => {
    expect(windCardinal(22)).toBe('N');
    expect(windCardinal(23)).toBe('NE');
    expect(windCardinal(67)).toBe('NE');
    expect(windCardinal(68)).toBe('E');
  });

  it('normalises angles outside [0, 360)', () => {
    expect(windCardinal(360)).toBe('N');
    expect(windCardinal(720)).toBe('N');
    expect(windCardinal(-45)).toBe('NW');
    expect(windCardinal(-90)).toBe('W');
  });
});
