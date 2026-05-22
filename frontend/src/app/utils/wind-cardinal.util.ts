/** 8-sector wind cardinal abbreviation (N, NE, E, SE, S, SW, W, NW). */
export type WindCardinal = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

const SECTORS: WindCardinal[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

/**
 * Convert a meteorological wind direction (degrees from which the wind blows)
 * into an 8-sector cardinal label. Values outside [0, 360) are normalised.
 */
export function windCardinal(degrees: number | null | undefined): WindCardinal | null {
  if (degrees === null || degrees === undefined || Number.isNaN(degrees)) {
    return null;
  }
  const normalised = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalised / 45) % 8;
  return SECTORS[index];
}
