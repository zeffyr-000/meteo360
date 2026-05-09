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
  --meteo-teal: #1f7a76;
  --meteo-sun: #d77a39;
  --meteo-sky: #def4ff;
  --meteo-mint: #e8f7f0;
  --meteo-warm: #fff1dd;
}
```

| Token | Purpose |
| ----- | ------- |
| `--meteo-ink` | primary text |
| `--meteo-muted` | secondary text and metadata |
| `--meteo-surface` | page background |
| `--meteo-teal` | actions, status, active states |
| `--meteo-sun` | warm weather accents and icons |
| `--meteo-sky` | cool atmospheric surfaces |
| `--meteo-mint` | supportive secondary surfaces |
| `--meteo-warm` | warm supporting surfaces |

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

- shell padding: `28px 24px 38px`
- mobile shell padding: `20px 16px 28px`
- main content grid gap: `16px`
- metrics grid gap: `12px`
- place list gap: `8px`
- daily grid gap: `10px`

## Visual Structure

### Top Bar

The top bar contains:

- a branded Material icon mark
- the product eyebrow and dashboard title
- a short subtitle
- a live status pill
- a refresh icon button with translated tooltip and ARIA label

### Search Panel

The search panel combines:

- explanatory copy on the left
- an outlined Material search field
- a primary search button
- a secondary current-location button
- translated location notices and error messages beneath the form

### Current Weather Panel

The hero panel shows:

- the selected place
- the current temperature
- a translated weather label
- a mapped weather icon inside a framed visual block
- Material chips for time, timezone, and day or night state
- six metric cards for key weather indicators

The panel supports a dark night-mode variant when the forecast reports `is_day === 0`.

### Places Panel

The places panel renders selectable place rows. The active row must remain obvious through both border and background changes, not color alone.

### Hourly Panel

The hourly panel renders a compact card strip with:

- time
- weather icon
- temperature
- precipitation probability
- `mat-progress-bar`
- wind speed

### Daily Cards

Each daily card shows:

- localized date
- translated weather condition label
- weather icon
- max and min temperatures in paired blocks
- rain and wind summary values

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
- the search panel becomes one column under `760px`
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
