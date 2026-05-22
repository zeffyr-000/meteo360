# Performance Guide - Meteo360

This document lists the performance guardrails for the Meteo360 MVP.

## Goals

- stable Angular production builds
- controlled frontend bundle size
- local fonts instead of remote font loading
- a lightweight backend API boundary
- no direct frontend dependency on Open-Meteo

## Production Build

Build command:

```bash
cd frontend
npm run build:prod
```

Expected output:

```text
www/dist/index.html
www/dist/main-*.js
www/dist/styles-*.css
```

Angular is configured to build directly into `www/dist`:

```json
"outputPath": {
  "base": "../www/dist",
  "browser": ""
}
```

## Current Budgets

From `frontend/angular.json`:

```json
{
  "type": "initial",
  "maximumWarning": "1.1MB",
  "maximumError": "1.3MB"
}
```

```json
{
  "type": "anyComponentStyle",
  "maximumWarning": "16kB",
  "maximumError": "20kB"
}
```

These limits account for Angular Material and Transloco MessageFormat.

## Allowed CommonJS Dependency

Transloco MessageFormat depends on `@messageformat/core`, which is explicitly allowed:

```json
"allowedCommonJsDependencies": ["@messageformat/core"]
```

Do not remove that allowance unless the MessageFormat dependency is replaced.

## Fonts And Icons

Fonts and icons are bundled locally. The current visual system imports:

- Roboto via `@fontsource/roboto` for body text and Material defaults
- Fraunces via `@fontsource/fraunces` for editorial display text
- Space Grotesk via `@fontsource/space-grotesk` for labels, compact metadata, and numerals
- Material Symbols Sharp via `material-symbols` for iconography

This avoids runtime font CDN dependencies, but the extra display and icon assets must be treated as part of the bundle budget. Before adding new font families or weights, measure the production build and remove unused imports where possible.

## Frontend Runtime Patterns

The current frontend implementation uses several low-overhead patterns:

- `ChangeDetectionStrategy.OnPush`
- local state stored in Signals
- `computed()` projections for daily and hourly preview data
- `takeUntilDestroyed()` for subscription cleanup
- request ID guards to ignore stale place-search and forecast responses
- `withFetch()` for the Angular `HttpClient` backend
- reduced-motion handling for global CSS animations and transitions
- scroll behavior that respects `prefers-reduced-motion` in the forecast timeline

Presentation logic should stay derived from canonical state instead of duplicating large payloads.

## Motion And Rendering Guardrails

The current UI includes custom motion for weather period changes, rolling numbers, hover feedback, and timeline scrolling. Keep these rules in place:

- animate `transform` and `opacity` first
- avoid animating layout properties such as width, height, top, left, margin, or padding
- use `will-change` only on elements that are actively animating or proven to need it
- keep large scene transitions on `--scene-duration` and small UI feedback on `--ui-duration`
- preserve the global reduced-motion override in `frontend/src/styles.scss`
- measure before optimizing timeline DOM work or SVG path generation

Timeline DOM measurement in `WeatherTimelineComponent` should stay scoped to the rendered strip, slot elements, and resize observer. If future changes make the strip fight user scrolling, add a small guard such as a last-centered slot key before introducing broader state machinery.

## Backend Guardrails

The backend weather service currently applies:

- a 10-second request timeout to Open-Meteo
- a 5-second connection timeout
- server-side response normalization before returning data to Angular

Keeping provider calls on the backend preserves a stable frontend contract and centralizes upstream error handling.

## Routing And Fallback

`www/.htaccess` serves `www/dist/index.html` for non-API routes so Angular routes remain functional in production without an extra Node or SSR layer.

## Future Performance Work

Evaluate only if the MVP grows beyond its current scope:

- audit imported Fraunces and Space Grotesk weights after production builds
- measure Material Symbols Sharp cost before adding another icon package
- short-lived backend cache for place lookups
- short-lived backend cache for forecasts by coordinates
- lazy loading if the app grows into multiple routed pages
- Lighthouse validation after production hardening
- end-to-end performance checks if critical workflows expand

## Anti-Patterns

- calling Open-Meteo directly from Angular
- adding heavy dependencies for formatting that Angular already handles well
- storing large duplicated payloads when a computed projection is enough
- introducing a service worker before a documented caching strategy exists
