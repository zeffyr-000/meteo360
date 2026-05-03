You are an expert in TypeScript, Angular 21, Angular Material, Transloco, PHP, and Jelix 1.7. You write maintainable, accessible, production-oriented code that follows the existing Meteo360 architecture.

## Architecture Overview

Meteo360 is an Angular 21 weather dashboard backed by a Jelix 1.7 API. The project intentionally follows the local/OVH shape used by `suiviseries` and `suiviseries-api`.

### Repository Layout

- `frontend/`: Angular 21 application.
- `app/`: Jelix configuration.
- `modules/commun/`: Jelix API controller and weather service.
- `plugins/`: Required by Jelix because it is declared in `application.init.php`, even if empty.
- `var/config/`: Jelix runtime config required for local and OVH execution.
- `www/`: Public web root with `index.php`, `.htaccess`, and Angular build output in `www/dist`.

### Core Constraints

- No Docker in this project.
- No database for the MVP.
- Do not add authentication, persistence, queues, or background jobs unless explicitly requested.
- Do not commit or push changes; the maintainer handles Git commits manually.
- Production URL is `https://meteo360.zeffyr.com/`.
- The OVH document root must point to the deployed `www/` directory.

## Developer Commands

Run frontend commands from `frontend/`:

```bash
npm start                    # Angular dev server with API proxy on http://localhost:4200
npm run build:prod           # Production build to ../www/dist
npm test -- --watch=false    # Vitest unit tests in CI mode
```

Validate backend PHP syntax locally with MAMP PHP:

```bash
cd /Users/sparkman/www/meteo360
find application.init.php modules app www -name '*.php' -print0 | xargs -0 -n1 /Applications/MAMP/bin/php/php7.4.33/bin/php -l
```

Local API checks:

```bash
curl 'http://localhost:8888/meteo360/www/api'
curl 'http://localhost:8888/meteo360/www/api/places?q=Paris&limit=5'
curl 'http://localhost:4200/api/places?q=Paris&limit=5'
```

## Local API Proxy

Development must match the `suiviseries` pattern:

```json
{
  "/api/**": {
    "target": "http://localhost:8888/meteo360/www/",
    "secure": false
  }
}
```

Do not change frontend services to absolute local or production API URLs. Frontend code should call relative `/api` endpoints through `WeatherService`.

## Angular Patterns

### Component Structure

Use Angular 21 standalone component patterns:

```typescript
@Component({
  selector: "app-example",
  imports: [TranslocoModule, MatButtonModule],
  templateUrl: "./example.html",
  styleUrl: "./example.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Example {
  private readonly service = inject(SomeService);
  protected readonly state = signal<State | null>(null);
  protected readonly derived = computed(() => this.state()?.value ?? null);
}
```

Rules:

- Keep templates and styles in separate files.
- Use `inject()` instead of constructor injection.
- Use Signals and `computed()` for local UI state.
- Use `takeUntilDestroyed()` for subscriptions in components.
- Keep component members `protected` when they are only used by templates.
- Do not add `standalone: true` unless a generated file requires it; Angular 21 treats components as standalone by default.
- Existing search uses `ReactiveFormsModule`; do not migrate forms unless the task is about forms.

### Templates

- Use `@if`, `@for`, and `@switch`; do not introduce `*ngIf` or `*ngFor`.
- Use class bindings instead of `ngClass` when practical.
- Avoid arrow functions and globals in templates.
- Use Angular pipes for display formatting (`date`, `number`) instead of formatting inline.
- Track repeated items with stable identifiers.

## Transloco i18n

Meteo360 uses Transloco exactly like `suiviseries`:

- `TranslocoInlineLoader` lives in `frontend/src/app/app.config.ts`.
- French translations live in `frontend/src/app/i18n/fr.ts`.
- Standalone components import `TranslocoModule`.
- Templates use `{{ 'key.path' | transloco }}`.
- Tests use `getTranslocoTestingModule()` from `frontend/src/app/testing/transloco-testing.module.ts`.

All user-facing frontend text must use translation keys. Do not add JSON translation assets unless explicitly requested.

## HTTP and Frontend Services

`WeatherService` is the frontend API boundary:

- Use `private readonly http = inject(HttpClient)`.
- Keep `private readonly apiBaseUrl = '/api'`.
- Return typed `Observable<T>` values.
- Map API envelopes to frontend models in the service.
- Let components handle user-visible loading and error states.

Current public methods:

- `searchPlaces(query: string, limit = 5)` -> `GET /api/places`
- `getForecast(latitude: number, longitude: number)` -> `GET /api/forecast`

## Material Design and UI

- Prefer Angular Material components over custom controls.
- Use Material icons from the configured icon font.
- Keep dashboard UI dense, readable, and operational rather than marketing-like.
- Cards should have modest radius, consistent with the existing `8px` style.
- Keep text inside controls from overflowing on mobile.
- Preserve responsive layout rules in `app.scss` and `styles.scss`.
- Use `@fontsource/roboto` and local Material Icons imports already configured in `styles.scss`.

## Testing Framework: Vitest

This project uses Angular's unit-test builder with Vitest, not Jasmine/Karma.

Use Vitest APIs:

```typescript
import { vi, expect } from "vitest";

const mockMethod = vi.fn();
vi.spyOn(service, "method");
vi.restoreAllMocks();
```

Test rules:

- Use `getTranslocoTestingModule()` for components using `transloco`.
- Mock `WeatherService` at the component boundary.
- Prefer testing rendered behavior and service contracts over implementation details.
- Keep tests fast and deterministic; do not call Open-Meteo from unit tests.

## Jelix Backend Patterns

### Routing

API routes are declared in `app/system/urls.xml` and served through `www/index.php`.

Current routes:

- `/api` -> `commun~default:index`
- `/api/places` -> `commun~default:places`
- `/api/forecast` -> `commun~default:forecast`

The `.htaccess` must support both:

- local MAMP path: `http://localhost:8888/meteo360/www/`
- production root path: `https://meteo360.zeffyr.com/`

It must also keep permanent redirects to the canonical production URL for:

- `http://meteo360.zeffyr.com/`
- `https://www.meteo360.zeffyr.com/`
- `http://www.meteo360.zeffyr.com/`

### Class Naming

Respect Jelix class selector conventions. For `jClasses::getService('commun~weather')`, the file and class must be:

```text
modules/commun/classes/weather.class.php
class weather
```

Do not use `weather.service.php` or `weatherService` for Jelix selectors.

### Controllers

Controllers extend `jController` and return Jelix JSON responses:

```php
$rep = $this->getResponse('json');
$rep->data = array('success' => true);
return $rep;
```

Use PHP 7.4-compatible syntax because local MAMP runs PHP 7.4.33. Avoid PHP 8-only features in backend code unless the local runtime is changed.

### Weather Provider

The backend talks to Open-Meteo:

- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Forecast: `https://api.open-meteo.com/v1/forecast`

Keep provider calls server-side. Do not expose provider-specific complexity in Angular components.

## Deployment and CI

GitHub Actions:

- `.github/workflows/ci.yml`: frontend tests/build and PHP syntax validation.
- `.github/workflows/deploy-prod.yml`: build, test, package, and deploy to OVH via SFTP/password with `lftp`.

Required secrets:

- `OVH_SFTP_HOST`
- `OVH_SFTP_PORT`
- `OVH_SFTP_USER`
- `OVH_SFTP_PASSWORD`
- `OVH_SFTP_REMOTE_DIR`

For the current OVH account, `OVH_SFTP_REMOTE_DIR=/` because the SFTP account already points at the Meteo360 project directory.

Do not reintroduce Docker, SSH-key deployment, database migrations, or Composer packages unless requested.

## Documentation

Keep documentation aligned with `suiviseries` quality:

- Update `README.md` for high-level onboarding.
- Add or update `docs/*.md` for detailed guides.
- Document local setup, API behavior, deployment, testing, i18n, design, and architecture when they change.
- Keep documentation truthful to the MVP; do not document OAuth, DB, PWA, or E2E features before they exist.

## Key Files

- `frontend/src/app/app.config.ts`: Angular providers, locale, Transloco inline loader.
- `frontend/src/app/app.ts`: root dashboard component and signal state.
- `frontend/src/app/services/weather.service.ts`: frontend API boundary.
- `frontend/src/app/i18n/fr.ts`: French translations.
- `frontend/src/app/testing/transloco-testing.module.ts`: Transloco test helper.
- `frontend/proxy.conf.json`: local API proxy.
- `app/system/mainconfig.ini.php`: Jelix main config.
- `app/system/urls.xml`: Jelix significant URLs.
- `modules/commun/controllers/default.classic.php`: public API controller.
- `modules/commun/classes/weather.class.php`: Open-Meteo service.
- `www/.htaccess`: local/prod routing and canonical redirects.
- `www/index.php`: Jelix public entry point.
