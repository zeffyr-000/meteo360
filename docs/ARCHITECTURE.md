# Technical Architecture - Meteo360

Meteo360 combines an Angular 21 weather dashboard with a Jelix 1.7 API in a single repository. The project is intentionally small for the MVP: no database, no authentication layer, no Docker, and no direct browser-to-provider calls.

## Architecture Goals

- keep frontend and backend deployable together on OVH
- use relative `/api` URLs so the frontend works through the same-origin backend in production
- preserve the local development shape that already works for sibling Jelix projects
- isolate Open-Meteo integration in the backend
- keep the Angular UI reactive, testable, and easy to evolve

## High-Level Flow

```text
Angular 21 UI
    |
    | Relative HTTP /api/*
    v
Angular dev proxy in local development
    |
    | http://localhost:8888/meteo360/www/
    v
Apache/MAMP or OVH
    |
    v
www/.htaccess
    |
    | /api/* -> www/index.php/api/*
    v
Jelix controller: commun~default
    |
    v
Jelix service: commun~weather
    |
    v
Open-Meteo APIs
```

## Repository Structure

```text
meteo360/
+-- app/
|   +-- system/
|       +-- mainconfig.ini.php
|       +-- framework.ini.php
|       +-- urls.xml
|       +-- index/config.ini.php
+-- frontend/
|   +-- src/app/
|   +-- proxy.conf.json
|   +-- angular.json
+-- modules/
|   +-- commun/
|       +-- controllers/default.classic.php
|       +-- classes/weather.class.php
+-- plugins/
+-- var/
|   +-- config/
|   +-- log/
|   +-- sessions/
|   +-- temp/
+-- www/
    +-- .htaccess
    +-- index.php
    +-- dist/
```

## Frontend Architecture

### Stack

- Angular 21
- TypeScript 5.9
- Angular Material 21
- RxJS 7.8
- Angular Signals
- Transloco and Transloco MessageFormat
- Vitest through Angular's unit-test builder

### Root Component Responsibilities

The MVP is currently hosted in the root `App` component in `frontend/src/app/app.ts`.

It owns:

- the search form state
- the place search results
- the selected place
- the loaded forecast
- loading, location, and error UI state
- computed hourly and daily preview data for rendering

### Frontend API Boundary

`frontend/src/app/services/weather.service.ts` is the Angular API boundary.

Rules enforced by the current implementation:

- keep `apiBaseUrl = '/api'`
- do not hardcode OVH or MAMP URLs in components
- map API envelopes to frontend models in the service
- keep UI loading and error presentation in the component layer

## Internationalization

Meteo360 follows the same inline Transloco pattern used by the sibling projects:

- translations are stored in `frontend/src/app/i18n/fr.ts`
- the inline loader lives in `frontend/src/app/app.config.ts`
- standalone components import `TranslocoModule`
- tests use `frontend/src/app/testing/transloco-testing.module.ts`

The MVP does not use JSON translation assets.

## Backend Architecture

### Entry Point

`www/index.php` boots Jelix and serves the API through the public `www/` directory.

### Routing

`app/system/urls.xml` declares the current public routes:

```text
/            -> default:index
/api         -> default:index
/api/places  -> default:places
/api/forecast -> default:forecast
```

### Controller Responsibilities

`modules/commun/controllers/default.classic.php`:

- normalizes request parameters
- adds CORS headers for the allowed origins
- serves the API status endpoint
- exposes `/api/places` and `/api/forecast`
- returns Jelix JSON responses with stable envelopes and HTTP status codes

### Weather Service Responsibilities

`modules/commun/classes/weather.class.php`:

- calls the Open-Meteo geocoding API
- calls the Open-Meteo forecast API
- validates coordinates before provider requests
- normalizes provider data into Meteo360-specific response shapes
- applies provider request timeouts and basic error handling

### Jelix Naming Rules

Jelix selectors require exact file and class names:

```text
jClasses::getService('commun~weather')
modules/commun/classes/weather.class.php
class weather
```

Do not rename this service to `weatherService` or `weather.service.php`.

## Hosting And Routing

`www/.htaccess` has three responsibilities:

- permanent redirects to the canonical production domain
- `/api` routing to Jelix
- SPA fallback to `www/dist/index.html`

It must stay compatible with both environments:

```text
Local:      http://localhost:8888/meteo360/www/
Production: https://meteo360.zeffyr.com/
```

## Weather Provider Boundary

Open-Meteo is called only from the backend:

- `https://geocoding-api.open-meteo.com/v1/search`
- `https://api.open-meteo.com/v1/forecast`

The frontend must not consume raw Open-Meteo responses directly. Meteo360 owns the public API contract exposed to Angular.

## Deployment Constraints

- the full repository is deployed, but OVH must serve the `www/` directory as the document root
- the Angular production build must land in `www/dist`
- PHP backend code must remain compatible with PHP 7.4 for local validation
- no Docker, database, queue, or background worker should be introduced unless the project scope changes
