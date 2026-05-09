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
  --meteo-teal: #1f7a76;
  --meteo-sun: #d77a39;
  --meteo-sky: #def4ff;
  --meteo-mint: #e8f7f0;
  --meteo-warm: #fff1dd;
}
```

Primary uses:

- `--meteo-ink`: main text color
- `--meteo-muted`: secondary text and metadata
- `--meteo-surface`: global page background
- `--meteo-teal`: actions, active states, status accents
- `--meteo-sun`: weather icons and warm accents
- `--meteo-sky`: light atmospheric surfaces
- `--meteo-mint`: secondary cool surfaces
- `--meteo-warm`: warm detail surfaces

## Angular Material Components In Use

The root dashboard currently imports and uses:

- `MatButtonModule`
- `MatCardModule`
- `MatChipsModule`
- `MatFormFieldModule`
- `MatIconModule`
- `MatInputModule`
- `MatProgressBarModule`
- `MatProgressSpinnerModule`
- `MatTooltipModule`

## Layout Rules

### Shell

The main `app-shell` combines a soft atmospheric gradient with subtle overlays. The implementation uses:

- `width: min(1180px, 100%)` for the main content containers
- desktop shell padding of `28px 24px 38px`
- mobile shell padding reduced to `20px 16px 28px`
- layered gradients and textures without flattening the dashboard into a plain surface

### Cards And Panels

The dashboard uses a consistent 8px radius across key surfaces:

```scss
border-radius: 8px;
```

This applies to:

- the brand mark
- the search panel
- the current weather panel
- places and hourly panels
- metric cards
- daily forecast cards
- place buttons and status pills

### Current Weather Panel

The current weather panel uses:

- a day theme by default
- a dedicated `.is-night` variant when `current.is_day === 0`
- a large weather icon frame
- Material chips for time, timezone, and day or night state
- six metric cards for apparent temperature, humidity, wind, rain, cloud cover, and wind direction

### Search And Discovery

The search area is built with:

- `mat-form-field` in `outline` appearance
- a flat primary action button for search
- a secondary stroked button for current location detection
- translated tooltip and ARIA labels for icon-only actions

### Forecast Views

- the places panel uses selectable button rows with an active state and a dedicated current-location variant
- the hourly panel uses compact cards with `mat-progress-bar` for precipitation probability
- the daily section uses uniform day cards with paired max and min temperature blocks

## Responsive Rules

Current breakpoints in `app.scss`:

```scss
@media (max-width: 1050px) { ... }
@media (max-width: 760px) { ... }
@media (max-width: 640px) { ... }
@media (max-width: 430px) { ... }
```

Behavior by breakpoint:

- under `1050px`, the main content grid collapses to a single column
- under `760px`, shell padding tightens and metrics move to two columns
- under `640px`, the top bar stacks vertically and the search form becomes one column
- under `430px`, metric cards and hourly cards collapse to a single column

Keep text from overflowing in buttons, cards, and metric values.

## Accessibility Expectations

- use Material components for built-in ARIA and keyboard support where possible
- keep `aria-label` and tooltips on icon-only actions
- preserve sufficient contrast between text and background layers
- do not rely on color alone to represent the active state
- keep focusable controls keyboard-accessible and visually distinct

## Weather Icon Mapping

The `App.weatherIcon()` method maps WMO groups to Material icons.

Current groups:

| WMO codes | Material icon |
| --------- | ------------- |
| `0` | `wb_sunny` |
| `1, 2, 3` | `filter_drama` |
| `51, 53, 55, 61, 63, 65, 80, 81, 82` | `grain` |
| `71, 73, 75, 77, 85, 86` | `ac_unit` |
| `95, 96, 99` | `flash_on` |
| fallback | `cloud` |
