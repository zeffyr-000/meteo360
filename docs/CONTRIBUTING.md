# Contributing Guide - Meteo360

This guide defines the contribution standards for Meteo360. The project aims for the same baseline as the already-validated sibling repositories: explicit conventions, maintainable code, accurate documentation, and respect for the existing Angular and Jelix architecture.

## Workflow

- work on short, focused branches
- keep features and unrelated refactors separate
- do not run destructive Git commands without explicit approval
- the maintainer handles commits and pushes manually when work is produced by an AI assistant

## Project Constraints

- no Docker in this project
- no database for the MVP
- no authentication unless explicitly requested
- no secrets in the repository
- keep the public API under `/api`
- keep production on `https://meteo360.zeffyr.com/`

## Angular Standards

### Components

- use Angular 21 standalone component patterns
- keep templates and styles in separate files
- use `ChangeDetectionStrategy.OnPush`
- use `inject()` instead of constructor injection
- use `signal()` and `computed()` for local UI state
- use `takeUntilDestroyed()` for subscriptions when needed
- keep members `protected` when they are only consumed by templates

### Templates

- use `@if`, `@for`, and `@switch`
- do not introduce `*ngIf` or `*ngFor`
- use Angular pipes for date and number formatting
- use stable `track` expressions in loops
- avoid complex inline template expressions

### Services

- keep HTTP calls inside Angular services
- do not call Open-Meteo directly from components
- keep API URLs relative
- map API envelopes to frontend models in the service layer

## Jelix Standards

### Service Naming

Respect Jelix selector conventions exactly:

```text
commun~weather -> modules/commun/classes/weather.class.php -> class weather
```

### Controllers

- controllers extend `jController`
- API endpoints return Jelix `json` responses
- provider errors must be caught and returned as stable JSON envelopes
- backend code must stay compatible with local PHP 7.4 validation

### Required Runtime Files

Do not remove these runtime paths:

```text
plugins/
var/config/installer.ini.php
var/config/localconfig.ini.php
var/config/liveconfig.ini.php
var/config/localurls.xml
```

They are required for the local and OVH execution model.

## Internationalization

All user-facing Angular text must go through Transloco:

```html
{{ 'weather.loading_forecast' | transloco }}
```

Translations currently live in:

```text
frontend/src/app/i18n/fr.ts
```

Do not add JSON translation files unless the project requirements change.

## UI And Material Design

- prefer Angular Material components over custom controls
- use the existing Material icon font
- keep the dashboard dense, readable, and responsive
- avoid decorative UI that does not support the weather workflow
- preserve mobile layout constraints

## Validation Before Review

From `frontend/`:

```bash
npm run lint
npm test -- --watch=false
npm run build:prod
```

From the repository root:

```bash
find application.init.php modules app www -name '*.php' -print0 | xargs -0 -n1 /Applications/MAMP/bin/php/php7.4.33/bin/php -l
```

Recommended proxy check:

```bash
curl 'http://localhost:4200/api/places?q=Paris&limit=5'
```

## Documentation Maintenance

Update documentation whenever a documented convention changes, especially for:

- local setup
- API routes or payloads
- OVH deployment
- Angular proxy behavior
- Jelix structure or runtime requirements
- Transloco usage
- test and validation commands

Do not document features that do not exist yet.
