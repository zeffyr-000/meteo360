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

Roboto is bundled locally through `@fontsource/roboto` and Material icons through the `material-icons` package. This avoids an external font CDN dependency during runtime.

## Frontend Runtime Patterns

The current frontend implementation uses several low-overhead patterns:

- `ChangeDetectionStrategy.OnPush`
- local state stored in Signals
- `computed()` projections for daily and hourly preview data
- `takeUntilDestroyed()` for subscription cleanup
- request ID guards to ignore stale place-search and forecast responses
- `withFetch()` for the Angular `HttpClient` backend

Presentation logic should stay derived from canonical state instead of duplicating large payloads.

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
