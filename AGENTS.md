# AI Agent Guide - Meteo360

> Primary guide for AI agents working in this repository.
> Read this file before making substantial code, documentation, or workflow changes.

## Agent Workflow Rules

- Do not commit or push changes. The maintainer handles Git commits and pushes manually.
- Use this file first for AI-specific behavior, then follow the documentation suite for domain-specific project rules.

## Project Scope

Meteo360 is a weather dashboard built with Angular 21 on the frontend and Jelix 1.7 on the backend.

Current scope:

- Angular dashboard in `frontend/`
- Jelix API at the repository root
- Open-Meteo integration on the backend only
- OVH deployment through `www/` and GitHub Actions

Out of scope unless explicitly requested:

- Docker
- database persistence
- authentication
- queues or background jobs
- service worker or PWA features
- Playwright end-to-end tests

## Required Reading Before Changes

1. This file
2. `docs/README.md`
3. The domain document you are modifying or depending on
4. The relevant `.github/instructions/*.instructions.md` file for the files in scope

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Frontend | Angular 21 standalone components |
| UI | Angular Material 21 |
| State | Angular Signals + RxJS |
| i18n | Transloco + Transloco MessageFormat |
| Backend | Jelix 1.7 + PHP 7.4-compatible code |
| Provider | Open-Meteo |
| Unit tests | Vitest via `@angular/build:unit-test` |
| Deployment | GitHub Actions + OVH SFTP |

## Architecture Overview

```text
Angular UI
    |
    | Relative /api requests
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
    | /api/* -> Jelix
    v
defaultCtrl
    |
    v
weather service
    |
    v
Open-Meteo
```

## Critical Rules

### 1. Frontend API Boundary

- Keep frontend API calls inside `WeatherService`.
- Keep `apiBaseUrl = '/api'`.
- Do not hardcode localhost or production API URLs in Angular components.
- Do not call Open-Meteo directly from Angular.

### 2. Angular Component Pattern

- Use standalone Angular 21 patterns.
- Use `inject()` instead of constructor injection.
- Use `ChangeDetectionStrategy.OnPush`.
- Use `signal()` and `computed()` for local UI state.
- Use `takeUntilDestroyed()` for subscriptions.
- Keep members `protected` when they are only used by templates.
- Keep `templateUrl` and `styleUrl` in separate files.

### 3. Angular Template Pattern

- Use `@if`, `@for`, and `@switch`.
- Do not introduce `*ngIf` or `*ngFor`.
- Track repeated items with stable identifiers.
- Use Angular pipes for formatting.
- Keep icon-only actions labeled with translated `aria-label` or tooltips.

### 4. Transloco Rules

- All user-facing Angular text must go through Transloco.
- The inline loader lives in `frontend/src/app/app.config.ts`.
- Translations currently live in `frontend/src/app/i18n/fr.ts`.
- Tests should use `getTranslocoTestingModule()` from `frontend/src/app/testing/transloco-testing.module.ts`.
- Do not introduce JSON translation assets unless the architecture changes.

### 5. Material And UI Rules

- Prefer Angular Material components over custom controls.
- Preserve the Meteo360 dashboard character: operational, dense, and readable.
- Reuse the existing token system and brutalist radius tokens (`--meteo-radius-block` 2px, `--meteo-radius-card` 4px, `--meteo-radius-panel` 6px, `--meteo-radius-pill` 999px).
- Preserve mobile behavior and prevent text overflow in controls and cards.

### 6. Jelix Backend Rules

- Controllers extend `jController` and return Jelix JSON responses.
- Keep PHP backend code compatible with PHP 7.4.
- Respect Jelix selector naming exactly:

```text
jClasses::getService('commun~weather')
-> modules/commun/classes/weather.class.php
-> class weather
```

- Keep the local and OVH routing model compatible.
- Keep provider-specific complexity on the backend.

### 7. Documentation Rules

- Write documentation and AI guidance in English.
- Keep documentation specific to Meteo360 instead of generic framework boilerplate.
- Update the relevant document when a documented rule changes.
- Do not document features that do not exist in this repository.

## Key Files

- `frontend/src/app/app.ts` - root dashboard logic
- `frontend/src/app/app.html` - dashboard template
- `frontend/src/app/app.scss` - dashboard component styling
- `frontend/src/app/app.config.ts` - Angular providers and Transloco inline loader
- `frontend/src/app/services/weather.service.ts` - frontend API boundary
- `frontend/src/app/i18n/fr.ts` - current translation source
- `frontend/proxy.conf.json` - local API proxy
- `app/system/urls.xml` - Jelix routes
- `modules/commun/controllers/default.classic.php` - public API controller
- `modules/commun/classes/weather.class.php` - Open-Meteo integration
- `www/.htaccess` - canonical redirects, API routing, SPA fallback
- `www/index.php` - Jelix public entry point

## Commands

Frontend commands run from `frontend/`:

```bash
npm start
npm run lint
npm test -- --watch=false
npm run build:prod
```

Backend syntax validation from the repository root:

```bash
find application.init.php modules app www -name '*.php' -print0 | xargs -0 -n1 /Applications/MAMP/bin/php/php7.4.33/bin/php -l
```

Useful API checks:

```bash
curl 'http://localhost:8888/meteo360/www/api'
curl 'http://localhost:8888/meteo360/www/api/places?q=Paris&limit=5'
curl 'http://localhost:4200/api/places?q=Paris&limit=5'
```

## Documentation Update Triggers

- Architecture or folder changes -> `docs/ARCHITECTURE.md`
- API changes -> `docs/API.md`
- Setup or proxy changes -> `docs/SETUP.md`
- Deployment or CI changes -> `docs/DEPLOYMENT.md`
- Test workflow changes -> `docs/TESTING.md`
- UI token or layout changes -> `docs/MATERIAL-DESIGN.md` and `DESIGN_SYSTEM.md`
- Transloco changes -> `docs/I18N.md`
- Shared project conventions -> `docs/CONTRIBUTING.md` and this file

## Working Principle

When documentation and prompt text overlap, keep the detailed rule in the documentation suite and keep AI instructions concise, high-signal, and aligned with those source documents.