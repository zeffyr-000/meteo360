// Maps Open-Meteo weather codes to translation keys and Material icons.

const RAINY = [51, 53, 55, 61, 63, 65, 80, 81, 82];
const SNOWY = [71, 73, 75, 77, 85, 86];
const STORM = [95, 96, 99];
const FOG = [45, 48];
const VARIABLE = [1, 2, 3];

export function weatherLabelKey(code: number | undefined): string {
  if (code === undefined) {
    return 'weather.invalid';
  }
  if (code === 0) {
    return 'weather.clear';
  }
  if (VARIABLE.includes(code)) {
    return 'weather.variable';
  }
  if (FOG.includes(code)) {
    return 'weather.fog';
  }
  if (RAINY.includes(code)) {
    return 'weather.rainy';
  }
  if (SNOWY.includes(code)) {
    return 'weather.snowy';
  }
  if (STORM.includes(code)) {
    return 'weather.storm';
  }
  return 'weather.cloudy';
}

export function weatherIcon(code: number | undefined): string {
  if (code === 0) {
    return 'wb_sunny';
  }
  if (VARIABLE.includes(code ?? -1)) {
    return 'filter_drama';
  }
  if (FOG.includes(code ?? -1)) {
    return 'blur_on';
  }
  if (RAINY.includes(code ?? -1)) {
    return 'grain';
  }
  if (SNOWY.includes(code ?? -1)) {
    return 'ac_unit';
  }
  if (STORM.includes(code ?? -1)) {
    return 'flash_on';
  }
  return 'cloud';
}
