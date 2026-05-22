# Material Design Guide - Meteo360

Meteo360 uses Angular Material 21 as the accessible interaction baseline and layers a project-specific neo-brutalist visual system on top. The UI goal is a compact, readable weather dashboard, not a marketing landing page.

Use `DESIGN_SYSTEM.md` for visual tokens. Use this guide for Material integration rules.

## UI Philosophy

- prioritize weather data readability
- keep primary actions visible and keyboard-accessible
- prefer Angular Material components for controls, dialogs, inputs, tooltips, and progress indicators
- keep custom UI focused on weather-specific visualization, such as glyphs, rolling numbers, UV meter, and timeline curve
- preserve mobile usability and touch-friendly controls

## Global Theme

The theme is configured in `frontend/src/styles.scss`:

```scss
@use '@angular/material' as mat;

html {
  @include mat.theme((
    color: (
      primary: mat.$azure-palette,
      tertiary: mat.$yellow-palette
    ),
    typography: (
      plain-family: 'Roboto',
      brand-family: 'Fraunces'
    ),
    density: (
      scale: 0
    )
  ));
}
```

Material provides component behavior and baseline theming. Meteo360 applies custom borders, typography, shadows, and scene colors through CSS custom properties.

## Fonts And Icons

Fonts and icons are loaded locally:

```scss
@import '@fontsource/roboto/300.css';
@import '@fontsource/roboto/400.css';
@import '@fontsource/roboto/500.css';
@import '@fontsource/roboto/700.css';

@import '@fontsource/fraunces/400.css';
@import '@fontsource/fraunces/500.css';
@import '@fontsource/fraunces/600.css';
@import '@fontsource/fraunces/700.css';
@import '@fontsource/fraunces/900.css';

@import '@fontsource/space-grotesk/400.css';
@import '@fontsource/space-grotesk/500.css';
@import '@fontsource/space-grotesk/700.css';

@import 'material-symbols/sharp.css';
```

`mat-icon` is globally mapped to Material Symbols Sharp with filled, heavier axes. Keep icon names compatible with Material Symbols.

## Material Components In Use

Current Angular Material modules include:

- `MatAutocompleteModule`
- `MatButtonModule`
- `MatDialogModule`
- `MatFormFieldModule`
- `MatIconModule`
- `MatInputModule`
- `MatProgressSpinnerModule`
- `MatSidenavModule`
- `MatTooltipModule`

Only import Material modules in components that need them. Keep standalone component imports explicit.

## Component Rules

### Buttons

- Use `mat-icon-button` for icon-only commands such as refresh, search, and scroll chevrons.
- Use `mat-stroked-button` for secondary textual commands such as returning to the live forecast.
- Keep icon-only buttons labeled with translated `aria-label` and tooltip text.
- Do not replace Material buttons with custom clickable divs.

### Dialogs And Forms

- Use `MatDialog` for the location search modal.
- Use `mat-form-field` with `appearance="outline"` for search input.
- Use `MatAutocomplete` for place suggestions.
- Style the dialog surface through scoped global overrides in `frontend/src/styles.scss`.

### Tooltips And Status

- Use `MatTooltip` for icon-only or compact controls.
- Do not use tooltip text as the only accessible label.
- Keep animated status text from becoming noisy in screen readers.

### Custom Weather Visualization

Custom UI is allowed when Material does not provide the weather-specific behavior:

- `app-weather-glyph` for Meteo360 weather identity
- `app-rolling-number` for large numeric weather readings
- SVG temperature curve in the timeline
- UV meter and sun progress indicators

Custom visualizations must expose meaningful ARIA attributes when they communicate data. Decorative glyphs should remain hidden from assistive tech when equivalent text is already present.

## Layout Rules

### Shell

The app shell combines Material navigation with a Meteo360 dashboard layer:

- `width: min(1180px, 100%)` for main content containers
- desktop shell padding around `28px 28px 46px`
- mobile shell padding reduced to `12px` to `18px`
- paper and atmospheric background treatment without landing-page composition

### Cards And Panels

The current shape scale is:

```scss
--meteo-radius-block: 2px;
--meteo-radius-card: 4px;
--meteo-radius-panel: 6px;
--meteo-radius-pill: 999px;
```

Use these tokens instead of raw `border-radius` values. The old 8px rule is obsolete.

### Current Weather Panel

The current weather panel uses Material for controls and progress feedback, then custom layout for weather reading:

- live or preview tags
- selected place and metadata
- rolling temperature display
- custom glyph frame
- wind, humidity, UV, and precipitation metric tiles
- sun progress or night summary
- panel transition sweep on selected period changes

The panel must remain data-first: avoid decorative copy and keep labels short.

### Timeline Panel

The timeline uses custom horizontal scrolling because it represents weather-specific forecast exploration:

- per-day groups
- slot cards
- SVG temperature curve
- Material icon buttons for desktop scroll controls
- touch scrolling under `760px`

Keep selection visible through shape, fill, and text treatment, not color alone.

## Responsive Rules

Use the existing breakpoints:

```scss
@media (max-width: 1050px) { ... }
@media (max-width: 760px) { ... }
@media (max-width: 600px) { ... }
@media (max-width: 430px) { ... }
```

Expected behavior:

- the dashboard remains a single column: current weather, then timeline
- under `760px`, timeline chevrons hide and touch scrolling becomes primary
- under `430px`, metric cards stay compact and timeline cards remain horizontally scrollable
- text must not overflow buttons, tags, cards, tiles, or timeline slots

## Accessibility Expectations

- preserve native Material keyboard behavior wherever possible
- keep focus indicators visible and high contrast
- add translated `aria-label` values for icon-only actions
- use ARIA meter/progress semantics for custom data displays when appropriate
- avoid announcing decorative animation changes
- verify contrast for `--brand-signal` on paper and ink surfaces before using it for small text

## Weather Icon Mapping

The `weatherIcon()` utility maps WMO groups to Material Symbols names.

| WMO codes | Symbol |
| --------- | ------ |
| `0` | `wb_sunny` |
| `1, 2, 3` | `filter_drama` |
| `51, 53, 55, 61, 63, 65, 80, 81, 82` | `grain` |
| `71, 73, 75, 77, 85, 86` | `ac_unit` |
| `95, 96, 99` | `flash_on` |
| fallback | `cloud` |

## Review Checklist

- Material controls are used where they provide accessibility or interaction behavior.
- Custom controls have keyboard, focus, and ARIA coverage.
- New user-facing text goes through Transloco.
- New SCSS uses design tokens instead of raw values when possible.
- Mobile behavior is checked at `760px` and `430px`.
- Animations still communicate state when reduced motion is enabled.
