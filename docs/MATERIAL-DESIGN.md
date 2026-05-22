# Material Design Guide - Meteo360

Meteo360 uses Angular Material 21 with a Material Design 3 theme. The UI goal is a compact, readable weather dashboard, not a marketing landing page.

## UI Philosophy

- prioritize weather data readability
- keep primary actions visible at all times
- prefer Angular Material components over custom controls
- use visual atmosphere without sacrificing operational clarity
- preserve mobile usability and touch-friendly controls

## Global Theme

The theme is configured in `frontend/src/styles.scss`:

```scss
@use '@angular/material' as mat;

html {
  @include mat.theme((
    color: (
      primary: mat.$azure-palette,
      tertiary: mat.$orange-palette
    ),
    typography: (
      plain-family: 'Roboto',
      brand-family: 'Roboto'
    ),
    density: (
      scale: 0
    )
  ));
}
```

Fonts and icons are loaded locally through:

```scss
@import '@fontsource/roboto/300.css';
@import '@fontsource/roboto/400.css';
@import '@fontsource/roboto/500.css';
@import '@fontsource/roboto/700.css';
@import 'material-icons/iconfont/material-icons.css';
```

## Project Tokens

Current global variables:

```scss
:root {
  --meteo-ink: #17383b;
  --meteo-muted: #607274;
  --meteo-surface: #f7fbfa;
  --meteo-surface-card: rgba(255, 255, 255, 0.86);
  --meteo-surface-raised: rgba(255, 255, 255, 0.96);
  --meteo-teal: #1f7a76;
  --meteo-sun: #d77a39;
  --meteo-rain: #4597be;
  --meteo-night: #233a57;
  --meteo-sky: #def4ff;
  --meteo-mint: #e8f7f0;
  --meteo-warm: #fff1dd;
  --meteo-border: rgba(23, 56, 59, 0.1);
  --meteo-border-strong: rgba(23, 56, 59, 0.18);
  --meteo-shadow-soft: 0 14px 32px rgba(23, 56, 59, 0.08);
  --meteo-shadow-panel: 0 24px 60px rgba(23, 56, 59, 0.12);
  --meteo-radius-card: 8px;
  --meteo-radius-panel: 8px;
}
```

Primary uses:

- `--meteo-ink`: main text color
- `--meteo-muted`: secondary text and metadata
- `--meteo-surface`: global page background
- `--meteo-surface-card`: translucent dashboard panels
- `--meteo-surface-raised`: raised controls and dialog surfaces
- `--meteo-teal`: actions, active states, status accents
- `--meteo-sun`: weather icons and warm accents
- `--meteo-rain`: precipitation data visualization
- `--meteo-night`: night and storm panel backgrounds
- `--meteo-sky`: light atmospheric surfaces
- `--meteo-mint`: secondary cool surfaces
- `--meteo-warm`: warm detail surfaces
- `--meteo-border`: default panel and tile borders
- `--meteo-border-strong`: emphasized borders and selected states
- `--meteo-shadow-soft`: small panel elevation
- `--meteo-shadow-panel`: primary dashboard panel elevation
- `--meteo-radius-card`: compact cards, controls, and metric tiles
- `--meteo-radius-panel`: dashboard panels and framed visual areas

## Angular Material Components In Use

The root dashboard currently imports and uses:

- `MatButtonModule`
- `MatAutocompleteModule`
- `MatDialogModule`
- `MatFormFieldModule`
- `MatIconModule`
- `MatInputModule`
- `MatProgressSpinnerModule`
- `MatTooltipModule`

## Layout Rules

### Shell

The main `app-shell` combines a soft atmospheric gradient with subtle overlays. The implementation uses:

- `width: min(1180px, 100%)` for the main content containers
- desktop shell padding of `28px 28px 46px`
- mobile shell padding reduced to `12px` to `18px` depending on viewport width
- layered gradients and textures without flattening the dashboard into a plain surface

### Cards And Panels

The dashboard uses a consistent 8px radius across key surfaces:

```scss
border-radius: 8px;
```

This applies to:

- the brand mark
- the search dialog
- the current weather panel
- the timeline panel
- metric cards
- search suggestion rows and status pills

### Current Weather Panel

The current weather panel uses:

- a day theme by default
- dedicated variants for night, rain, storm, snow, and fog states
- a large weather icon frame
- compact context chips for time, timezone, and day or night state
- three primary metric cards for apparent temperature, rain, and wind
- detail tiles for humidity, cloud cover, wind direction, and update time

### Search And Discovery

The search area is built with:

- `mat-form-field` in `outline` appearance
- autocomplete suggestions with place metadata
- a secondary stroked button for current location detection
- translated tooltip and ARIA labels for icon-only actions
- typed hint, empty, and error notices with icons

### Forecast Views

- the timeline panel is the central forecast surface: per-day groups, scroll chevrons on desktop, and a mini temperature curve drawn as an SVG overlay
- timeline slots are selectable cards exposing condition, temperature, rain probability, and wind speed

## Responsive Rules

Current breakpoints across component SCSS files (`dashboard.component.scss`, `current-conditions.component.scss`, etc.):

```scss
@media (max-width: 1050px) { ... }
@media (max-width: 760px) { ... }
@media (max-width: 600px) { ... }
@media (max-width: 430px) { ... }
```

Behavior by breakpoint:

- under `1050px`, the dashboard grid keeps its single column stack (hero then timeline)
- under `760px`, shell padding tightens, masthead secondary elements (eyebrow, rule, status) are hidden while the single-row layout is preserved, hero stacks to one column, metrics move to two columns and timeline chevrons are hidden in favor of touch scrolling
- under `600px`, dashboard shell gap tightens further
- under `430px`, metric cards and hourly cards collapse to a single column

Keep text from overflowing in buttons, cards, and metric values.

## Accessibility Expectations

- use Material components for built-in ARIA and keyboard support where possible
- keep `aria-label` and tooltips on icon-only actions
- preserve sufficient contrast between text and background layers
- do not rely on color alone to represent the active state
- keep focusable controls keyboard-accessible and visually distinct

## Weather Icon Mapping

The `weatherIcon()` utility maps WMO groups to Material icons.

Current groups:

| WMO codes | Material icon |
| --------- | ------------- |
| `0` | `wb_sunny` |
| `1, 2, 3` | `filter_drama` |
| `51, 53, 55, 61, 63, 65, 80, 81, 82` | `grain` |
| `71, 73, 75, 77, 85, 86` | `ac_unit` |
| `95, 96, 99` | `flash_on` |
| fallback | `cloud` |
