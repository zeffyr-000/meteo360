# Meteo360

Meteo360 is a weather dashboard built with an Angular 21 frontend and a Jelix 1.7 backend API. The MVP intentionally keeps the stack simple: no database, no authentication layer, and no direct frontend calls to Open-Meteo.

Production URL: [https://meteo360.zeffyr.com/](https://meteo360.zeffyr.com/)

## Tech Stack

- Angular 21 standalone components, Signals, `inject()`, `ChangeDetectionStrategy.OnPush`
- Angular Material 21 with a Material Design 3 theme
- Transloco and Transloco MessageFormat with inline TypeScript translations
- Jelix 1.7 for the PHP API layer
- Open-Meteo for geocoding and forecast data
- GitHub Actions for CI and OVH deployment through SFTP

## MVP Features

- Place search powered by Open-Meteo geocoding
- Current weather for the selected location
- Hourly forecast preview for the next hours
- Seven-day forecast preview
- Responsive dashboard layout built with Angular Material
- Relative `/api` routing in development and production
- Canonical production redirects to `https://meteo360.zeffyr.com/`

## Repository Shape

Meteo360 follows the same local/OVH deployment shape used by the validated sibling Jelix projects: the backend lives at the repository root, the Angular app lives in `frontend/`, and the production build is emitted to `www/dist`.

```text
meteo360/
+-- app/                 # Jelix configuration
+-- frontend/            # Angular 21 application
+-- modules/             # Jelix modules
|   +-- commun/          # Public API controller and weather service
+-- plugins/             # Required by Jelix even when empty
+-- var/                 # Runtime config, cache, logs, sessions
+-- www/                 # Public web root
        +-- index.php        # Jelix entry point
        +-- .htaccess        # API routing, SPA fallback, canonical redirects
        +-- dist/            # Angular production build output
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full runtime and deployment model.

## Quick Start

Prerequisites:

- Node.js 22
- npm 10
- MAMP or another local Apache/PHP setup exposed through `http://localhost:8888/`
- Jelix 1.7 installed in the sibling path `../jelix/lib1.7`

Start the frontend from `frontend/`:

```bash
cd frontend
npm install
npm start
```

The Angular dev server runs on `http://localhost:4200/`.

## Local API Proxy

Frontend code must keep calling relative `/api` endpoints. In development, the Angular proxy forwards those requests to the local Jelix app:

```json
{
    "/api/**": {
        "target": "http://localhost:8888/meteo360/www/",
        "secure": false
    }
}
```

Useful local checks:

```bash
curl 'http://localhost:8888/meteo360/www/api'
curl 'http://localhost:8888/meteo360/www/api/places?q=Paris&limit=5'
curl 'http://localhost:4200/api/places?q=Paris&limit=5'
```

See [docs/SETUP.md](docs/SETUP.md) for the complete local setup guide.

## Public API

Current MVP endpoints:

```text
GET /api
GET /api/places?q=Paris&limit=5
GET /api/forecast?latitude=48.85341&longitude=2.3488
```

The Angular frontend consumes those endpoints through `WeatherService` and does not depend on raw Open-Meteo payloads.

See [docs/API.md](docs/API.md) for request and response details.

## Quality Checks

Frontend checks:

```bash
cd frontend
npm run build:prod
npm test -- --watch=false
```

Backend PHP syntax validation:

```bash
cd /Users/sparkman/www/meteo360
find application.init.php modules app www -name '*.php' -print0 | xargs -0 -n1 /Applications/MAMP/bin/php/php7.4.33/bin/php -l
```

Related guides:

- [docs/TESTING.md](docs/TESTING.md)
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
- [docs/PERFORMANCE.md](docs/PERFORMANCE.md)

## Deployment

Production deployment is handled by `.github/workflows/deploy-prod.yml` on `main` and through `workflow_dispatch`.

Required GitHub Actions secrets:

```text
OVH_SFTP_HOST
OVH_SFTP_PORT
OVH_SFTP_USER
OVH_SFTP_PASSWORD
OVH_SFTP_REMOTE_DIR
```

For the current OVH SFTP account, `OVH_SFTP_REMOTE_DIR=/` because the account already points at the Meteo360 project directory. The OVH document root must point to the deployed `www/` folder.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the full deployment guide.

## Documentation

- [AGENTS.md](AGENTS.md) - central AI guide and project-specific agent rules
- [docs/README.md](docs/README.md) - documentation index and update triggers
- [docs/SETUP.md](docs/SETUP.md) - local installation and troubleshooting
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - frontend/backend architecture
- [docs/API.md](docs/API.md) - public API contract
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - OVH deployment and redirects
- [docs/TESTING.md](docs/TESTING.md) - testing and validation workflow
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) - development standards
- [docs/MATERIAL-DESIGN.md](docs/MATERIAL-DESIGN.md) - Angular Material usage
- [docs/I18N.md](docs/I18N.md) - Transloco setup and localization rules
- [docs/PERFORMANCE.md](docs/PERFORMANCE.md) - budgets and performance guardrails
- [docs/DOCUMENTATION_STATUS.md](docs/DOCUMENTATION_STATUS.md) - documentation standard and maintenance scope
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) - design tokens and UI conventions

## Project Constraints

- No Docker in this project.
- No database for the MVP.
- No automatic commits; the maintainer handles Git commits manually.
- The Jelix backend must stay compatible with both `http://localhost:8888/meteo360/www/` and `https://meteo360.zeffyr.com/`.
