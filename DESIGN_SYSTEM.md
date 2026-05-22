# Design System - Meteo360

Meteo360 uses a compact weather dashboard design system. The current visual direction combines Angular Material 21 structure with a Meteo360-specific neo-brutalist layer: ink borders, paper surfaces, sodium-yellow signal states, hard offset shadows, editorial type, and dense weather data surfaces.

This document is the source of truth for visual tokens and UI conventions. Keep it aligned with `frontend/src/styles.scss` when the visual system changes.

## Foundations

### UI Stack

- Angular Material 21 and Material Design 3 theme primitives
- local Roboto fonts via `@fontsource/roboto`
- local Fraunces fonts via `@fontsource/fraunces` for editorial display text
- local Space Grotesk fonts via `@fontsource/space-grotesk` for labels, numerals, and compact metadata
- Material Symbols Sharp via `material-symbols`
- global tokens and Material overrides in `frontend/src/styles.scss`
- component styles in `frontend/src/app/**/*.scss`

### Brand Tokens

Core tokens live in `frontend/src/styles.scss`:

```scss
:root {
  --brand-ink: #0e1b2c;
  --brand-ink-soft: #1c2f47;
  --brand-paper: #f4efe6;
  --brand-paper-warm: #ece4d3;
  --brand-signal: #f4c430;
  --brand-signal-deep: #d9a800;
  --brand-rouge: #e63946;
  --brand-azure: #4597be;
}
```

| Token | Purpose |
| ----- | ------- |
| `--brand-ink` | main text, borders, hard shadows, dark filled states |
| `--brand-ink-soft` | dark supporting surfaces |
| `--brand-paper` | base paper surface |
| `--brand-paper-warm` | warmer supporting paper surface |
| `--brand-signal` | primary attention color, selected states, focus accents |
| `--brand-signal-deep` | weather accent and warm detail color |
| `--brand-rouge` | error, danger, and strong warning accents |
| `--brand-azure` | precipitation and cool weather accents |

### Legacy Meteo Tokens

Legacy `--meteo-*` tokens are still available for compatibility, but they are remapped to the current brand palette. New SCSS should prefer brand, scene, shape, and shadow tokens unless a legacy token is already the local convention.

```scss
--meteo-ink: var(--brand-ink);
--meteo-muted: #5a6b80;
--meteo-surface: var(--brand-paper);
--meteo-surface-card: rgba(255, 255, 255, 0.92);
--meteo-surface-raised: #ffffff;
--meteo-teal: var(--brand-ink);
--meteo-sun: var(--brand-signal-deep);
--meteo-rain: var(--brand-azure);
--meteo-night: var(--brand-ink);
--meteo-border: rgba(14, 27, 44, 0.14);
--meteo-border-strong: var(--brand-ink);
```

### Scene Tokens

Scene tokens keep weather panels adaptable without renaming every component selector:

```scss
--scene-fg: var(--brand-ink);
--scene-fg-muted: #4a5566;
--scene-accent: var(--brand-signal-deep);
--scene-paper: #f4efe6;
--scene-surface: #f7f2e9;
--scene-surface-soft: #efe8d8;
--scene-rule: rgba(14, 27, 44, 0.32);
--scene-glow: rgba(244, 196, 48, 0.32);
```

Use scene tokens for the current weather and timeline surfaces when the color should respond to weather context. Use brand tokens for fixed product identity.

## Shape And Elevation

The previous 8px radius convention no longer applies. Meteo360 now uses a tighter brutalist radius scale:

| Token | Value | Usage |
| ----- | ----- | ----- |
| `--meteo-radius-block` | `2px` | icon marks, slot cards, compact chips, sharp controls |
| `--meteo-radius-card` | `4px` | dialogs, search rows, repeated cards |
| `--meteo-radius-panel` | `6px` | dashboard panels and framed weather surfaces |
| `--meteo-radius-pill` | `999px` | status tags, pills, compact labels |

Borders are intentionally visible:

```scss
--brand-border-w: 1.5px;
--brand-border-w-strong: 2.5px;
```

Hard shadows should be tokenized so components keep the same physical language:

```scss
--meteo-shadow-offset-xs: 2px 2px 0 0;
--meteo-shadow-offset-sm: 3px 3px 0 0;
--meteo-shadow-offset-md: 4px 4px 0 0;
--meteo-shadow-offset-lg: 5px 5px 0 0;
--meteo-shadow-offset-panel: 6px 6px 0 0;
--meteo-shadow-offset-dialog: 8px 8px 0 0;
--meteo-shadow-offset-rail: 8px 0 0 0;
--meteo-shadow-soft: var(--meteo-shadow-offset-xs) var(--brand-ink);
--meteo-shadow-panel: var(--meteo-shadow-offset-md) var(--brand-ink);
--meteo-shadow-ambient: 0 4px 0 0 rgba(14, 27, 44, 0.08);
--meteo-ring-signal: 0 0 0 3px rgba(244, 196, 48, 0.3);
--meteo-ring-signal-soft: 0 0 0 2px rgba(244, 196, 48, 0.35);
--meteo-ring-rouge: 0 0 0 3px rgba(230, 57, 70, 0.3);
--meteo-ring-rouge-clear: 0 0 0 6px rgba(230, 57, 70, 0);
--meteo-ring-ink: 0 0 0 1px var(--brand-ink);
--meteo-highlight-inset: inset 0 2px 0 rgba(255, 255, 255, 0.32);
```

Use offset tokens with the local semantic color when the shadow color changes by context:

```scss
box-shadow: var(--meteo-shadow-offset-md) var(--scene-fg);
```

When a component needs a larger or new kind of shadow, add or reuse a semantic shadow token in `frontend/src/styles.scss` instead of scattering raw values through component SCSS.

## Typography

Meteo360 uses three type roles:

- Roboto for body text and Material component defaults.
- Fraunces for editorial display text, section titles, place names, and large weather readings.
- Space Grotesk for labels, metadata, compact numerals, tags, and dashboard chrome.

Rules:

- keep hero-scale type inside true dashboard hero surfaces only
- keep compact panels tight and readable
- use tabular numerals for repeated weather values when alignment matters
- avoid negative letter spacing in compact labels
- keep uppercase micro-labels short so they do not dominate data values
- use Angular pipes for dates and numbers instead of manual formatting

## Motion

Motion tokens live in `frontend/src/styles.scss`:

```scss
--scene-duration: 800ms;
--scene-easing: cubic-bezier(0.22, 0.61, 0.36, 1);
--ui-duration: 180ms;
--ui-easing: cubic-bezier(0.2, 0, 0, 1);
```

Use `--ui-duration` for hover, focus, button, and slot-card feedback. Use `--scene-duration` only for larger weather-surface transitions. Animations should primarily use `transform` and `opacity`; avoid animating layout properties.

Reduced motion is handled globally in `frontend/src/styles.scss`. New animations must remain understandable when reduced motion is active.

## Visual Structure

### App Shell

The root shell combines:

- a persistent navigation surface
- a compact masthead with search and refresh actions
- a paper-like atmospheric background
- a routed content area for dashboard, legal, and not-found views

The app is an operational weather dashboard, not a landing page. Keep the first screen useful and data-forward.

### Current Weather Panel

The current weather panel is the primary data surface. It contains:

- identity banner with place, detection state, timezone, and live or preview tags
- large temperature display with `app-rolling-number`
- weather condition and custom `app-weather-glyph`
- hourly preview values when a timeline slot is selected
- wind, humidity, UV, and precipitation metric tiles
- UV meter using a 0-10 bounded bar display
- sun progress or night summary based on daily sunrise and sunset data
- panel-level period sweep when the selected forecast period changes

The panel should stay dense but legible. The temperature is the visual anchor; supporting metrics should not compete with it.

### Timeline Panel

The timeline is the central forecast exploration surface. It renders:

- per-day groups with today, tomorrow, and date labels
- an SVG temperature curve aligned to slot centers
- a compact curve legend
- desktop scroll chevrons
- touch-friendly horizontal scrolling under `760px`
- slot cards with time, condition, temperature, precipitation probability, and wind speed

The selected slot is auto-centered and uses a filled brutalist state. The `now` slot uses the dark filled variant.

### Search Dialog

Search uses Angular Material dialog, form field, input, autocomplete, buttons, icons, and tooltips. The Meteo360 layer applies hard borders, compact spacing, and brand typography. Keep suggestions readable and avoid turning the dialog into a custom non-Material modal.

## Responsive Behavior

Use the existing breakpoint system unless a deliberate layout change is documented:

- `1050px`
- `760px`
- `600px`
- `430px`

Current expectations:

- the dashboard keeps a single-column stack: current conditions first, timeline second
- under `760px`, masthead secondary elements reduce, timeline chevrons hide, and touch scrolling becomes primary
- under `430px`, metric cards remain compact and the timeline stays horizontally scrollable
- labels, place names, buttons, and weather values must not overflow their containers

## Accessibility Rules

- prefer Material components for built-in keyboard and ARIA behavior
- keep translated `aria-label` or tooltip text on icon-only actions
- preserve visible focus states using the signal color
- do not rely on color alone for selected, live, error, or warning states
- keep text contrast readable across paper, ink, signal, rouge, and azure surfaces
- ensure custom meters and progress indicators expose appropriate ARIA attributes
- verify animated status text does not cause noisy announcements

## Maintenance Rules

- Update this file and `docs/MATERIAL-DESIGN.md` when visual tokens or component conventions change.
- Keep raw values out of component SCSS when an existing token expresses the same role.
- Add a new token only when the value represents a reusable visual decision.
- Do not copy Suiviseries visual choices directly; use sibling-project practices for documentation, review checklists, and quality gates.
