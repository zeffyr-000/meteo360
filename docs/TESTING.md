# Testing Guide - Meteo360

This guide documents the validation workflow for Meteo360. The MVP remains intentionally small, but the project still expects fast, reliable checks before code is considered ready.

## Frontend Test Framework

Meteo360 uses Angular's `@angular/build:unit-test` builder with Vitest.

Important rules:

- do not use Jasmine or Karma patterns
- use Vitest helpers such as `vi.fn()`, `vi.spyOn()`, and `vi.restoreAllMocks()`
- never call Open-Meteo from a unit test

## Validation Commands

From `frontend/`:

```bash
npm run lint
npm test -- --watch=false
npm run build:prod
```

From the repository root for local PHP syntax validation:

```bash
find application.init.php modules app www -name '*.php' -print0 | xargs -0 -n1 /Applications/MAMP/bin/php/php7.4.33/bin/php -l
```

## Component Tests

The root app uses Transloco, so tests that render translated UI should include the shared testing helper:

```typescript
import { getTranslocoTestingModule } from './testing/transloco-testing.module';
```

Example:

```typescript
await TestBed.configureTestingModule({
  imports: [App, getTranslocoTestingModule()],
  providers: [{ provide: WeatherService, useValue: weatherServiceMock }],
}).compileComponents();
```

## Vitest Mocks

Preferred pattern:

```typescript
import { vi } from 'vitest';

const weatherServiceMock = {
  searchPlaces: vi.fn(),
  getForecast: vi.fn(),
};

afterEach(() => {
  vi.restoreAllMocks();
});
```

Avoid Jasmine-style APIs such as:

```typescript
jasmine.createSpyObj();
spy.and.returnValue();
spy.calls.reset();
```

## Transloco Testing

The shared helper lives in:

```text
frontend/src/app/testing/transloco-testing.module.ts
```

Rules:

- do not rebuild `TranslocoTestingModule.forRoot()` inline in each spec
- import `getTranslocoTestingModule()` instead
- keep test translations aligned with `frontend/src/app/i18n/fr.ts`

## HTTP Service Tests

For service-level tests, use Angular HTTP testing utilities and keep requests relative:

```typescript
const req = httpMock.expectOne('/api/places?q=Paris&limit=5');
expect(req.request.method).toBe('GET');
```

Do not assert against `http://localhost:8888` in Angular unit tests.

## Manual API Checks

Direct backend checks:

```bash
curl 'http://localhost:8888/meteo360/www/api'
curl 'http://localhost:8888/meteo360/www/api/places?q=Paris&limit=5'
curl 'http://localhost:8888/meteo360/www/api/forecast?latitude=48.85341&longitude=2.3488'
```

Through the Angular proxy:

```bash
curl 'http://localhost:4200/api/places?q=Paris&limit=5'
```

## Canonical Redirect Checks

You can test canonical redirect behavior locally with host headers:

```bash
curl -I -H 'Host: meteo360.zeffyr.com' 'http://localhost:8888/meteo360/www/api'
curl -I -H 'Host: www.meteo360.zeffyr.com' 'http://localhost:8888/meteo360/www/api'
```

The expected result is a `301` redirect to `https://meteo360.zeffyr.com/api`.

## CI Coverage

The current CI workflow runs:

- frontend lint
- frontend unit tests
- frontend production build
- PHP syntax validation

## Pre-Review Checklist

- `npm run lint` passes
- `npm test -- --watch=false` passes
- `npm run build:prod` passes
- the build produces `www/dist/index.html`
- PHP syntax validation passes
- `/api/places?q=Paris&limit=5` returns `200` locally
- Angular does not call Open-Meteo directly
- new UI text goes through Transloco
- documentation is updated when a documented convention changes
