import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type WeatherGlyph =
    | 'sun'
    | 'moon'
    | 'cloud'
    | 'partly-cloudy'
    | 'rain'
    | 'snow'
    | 'storm'
    | 'fog';

/**
 * Custom brutalist weather icons drawn inline as SVG.
 * Replaces Material icons in the headline block to give Meteo360 its own
 * recognizable visual language. All glyphs inherit color from currentColor.
 */
@Component({
  selector: 'app-weather-glyph',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './weather-glyph.component.html',
  styleUrl: './weather-glyph.component.scss',
  host: { class: 'weather-glyph', 'aria-hidden': 'true' }
})
export class WeatherGlyphComponent {
  readonly glyph = input.required<WeatherGlyph>();
}
