# Design System - Meteo360

Meteo360 uses a compact design system optimized for reading weather data quickly. The visual direction combines Material structure with a soft atmospheric styling layer built in SCSS.

## Foundations

### UI Stack

- Angular Material 21
- Material Design 3 through `@angular/material`
- local Roboto fonts via `@fontsource/roboto`
- Material Icons via `material-icons`
- global styles in `frontend/src/styles.scss`
- component styles in `frontend/src/app/app.scss`

### Color Tokens

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

| Token | Purpose |
| ----- | ------- |
| `--meteo-ink` | primary text |
| `--meteo-muted` | secondary text and metadata |
| `--meteo-surface` | page background |
| `--meteo-surface-card` | translucent dashboard panels |
| `--meteo-surface-raised` | raised controls and dialog surfaces |
| `--meteo-teal` | actions, status, active states |
| `--meteo-sun` | warm weather accents and icons |
| `--meteo-rain` | precipitation data visualization |
| `--meteo-night` | night and storm panel backgrounds |
| `--meteo-sky` | cool atmospheric surfaces |
| `--meteo-mint` | supportive secondary surfaces |
| `--meteo-warm` | warm supporting surfaces |
| `--meteo-border` | default panel and tile borders |
| `--meteo-border-strong` | emphasized borders and selected states |
| `--meteo-shadow-soft` | small panel elevation |
| `--meteo-shadow-panel` | primary dashboard panel elevation |
| `--meteo-radius-card` | compact cards, controls, and metric tiles |
| `--meteo-radius-panel` | dashboard panels and framed visual areas |

Material palette choices:

- primary: `mat.$azure-palette`
- tertiary: `mat.$orange-palette`

## Typography

Roboto is the base typeface.

Rules:

- keep headings short and readable
- avoid decorative letter spacing
- do not introduce oversized hero copy in compact dashboard panels
- keep card labels concise
- use Angular pipes for dates and numbers instead of manual formatting

## Shape Language

The dashboard uses a consistent moderate radius:

```scss
border-radius: 8px;
```

This applies to key surfaces and controls, including cards, place buttons, status pills, weather icon frames, metric tiles, and the search area.

## Spacing System

Main containers:

```scss
width: min(1180px, 100%);
margin: 0 auto;
```

Common spacing values in the current UI:

- shell padding: `28px 28px 46px`
- mobile shell padding: `12px` to `18px` depending on viewport width
- main content grid gap: `14px` to `18px`
- metrics grid gap: `8px`
- timeline card gap: `10px`
- daily grid gap: `10px`

## Visual Structure

### Top Bar

The top bar contains:

- a branded Material icon mark
- the product eyebrow and dashboard title
- a short subtitle
- a live status pill
- search and refresh icon buttons with translated tooltips and ARIA labels

### Search Dialog

The search dialog combines:

- a compact atmospheric header with an icon mark
- an outlined Material search field
- autocomplete suggestions with place metadata
- typed hint, empty, and error notices
- a secondary current-location action

### Dashboard Shell

The root dashboard renders:

- the current weather hero panel
- the forecast overview panels for the next hours and seven days
- the exploratory timeline strip

### Current Weather Panel

The hero panel shows:

- the selected place
- the current temperature
- a translated weather label
- a mapped weather icon inside a framed visual block
- compact context chips for time, timezone, and day or night state
- three primary metric tiles for apparent temperature, rain, and wind
- detail tiles for humidity, cloud cover, wind direction, and update time

The panel supports variants for night, rain, storm, snow, and fog states based on the active forecast hour.

### Forecast Overview

The forecast overview uses two compact panels:

- a 12-hour trend panel with native CSS/HTML bars for temperature and precipitation
- a seven-day panel with temperature range bars plus rain and wind summaries

This view is built from the existing `hourlyPreview` and `dailyPreview` signals and does not require a charting dependency.

### Timeline Panel

The timeline panel renders a compact card strip with:

- time
- weather icon
- translated weather condition
- temperature
- precipitation probability
- wind speed

## Background And Atmosphere

The dashboard is intentionally not a flat white interface. The shell combines:

- a large background gradient
- a subtle diagonal texture overlay
- a low atmospheric band clipped across the bottom of the viewport

This visual treatment should remain lightweight and readable rather than decorative for its own sake.

## Responsive Behavior

Key breakpoints:

- `1050px`
- `760px`
- `640px`
- `430px`

Current responsive rules:

- the main content grid collapses to one column under `1050px`
- the forecast overview collapses to one column under `1050px`
- the top bar stacks vertically under `640px`
- metric cards and hourly items become single-column under `430px`
- daily cards also collapse to one column on smaller screens

Keep button labels, place names, and metric values from overflowing on narrow screens.

## Accessibility Rules

- prefer Material components for accessible baseline behavior
- keep explicit labels and tooltips on icon-only actions
- maintain readable color contrast across all layered surfaces
- preserve visible active, hover, and focus states
- do not communicate status through color alone
