# Deployment Guide - Meteo360

Meteo360 is deployed to OVH through GitHub Actions and SFTP. The deployment model is intentionally simple: no Docker, no database migrations, and no separate frontend or backend deployment pipelines.

## Production URL

Canonical production URL:

```text
https://meteo360.zeffyr.com/
```

The following variants must redirect permanently to the canonical URL:

```text
http://meteo360.zeffyr.com/
https://www.meteo360.zeffyr.com/
http://www.meteo360.zeffyr.com/
```

Redirects must preserve the request path and query string.

## OVH Document Root

The full repository is deployed to OVH, but the public document root must point to:

```text
<project-directory>/www/
```

Production frontend assets are served from:

```text
www/dist/
```

The backend entry point is:

```text
www/index.php
```

## GitHub Actions Workflows

CI workflow:

```text
.github/workflows/ci.yml
```

Production deployment workflow:

```text
.github/workflows/deploy-prod.yml
```

Production deployment triggers:

- push to `main`
- manual `workflow_dispatch`

## Required Secrets

```text
OVH_SFTP_HOST
OVH_SFTP_PORT
OVH_SFTP_USER
OVH_SFTP_PASSWORD
OVH_SFTP_REMOTE_DIR
```

Known non-secret project values:

```text
OVH_SFTP_HOST=ssh.cluster103.hosting.ovh.net
OVH_SFTP_PORT=22
OVH_SFTP_USER=zeffyr-meteo360
OVH_SFTP_REMOTE_DIR=/
```

`OVH_SFTP_REMOTE_DIR=/` is intentional because the SFTP account already points at the Meteo360 project directory.

## Deployment Pipeline

The production workflow currently performs these steps:

1. Check out the repository.
2. Set up Node.js 22.
3. Run `npm ci` in `frontend/`.
4. Run frontend lint.
5. Run frontend unit tests.
6. Build the Angular production bundle.
7. Set up PHP 7.4 in CI.
8. Run PHP syntax validation outside `frontend/` and `www/dist/`.
9. Check that the OVH SFTP secrets are present.
10. Prepare a `release/` directory with excluded development files removed.
11. Install `lftp`.
12. Upload the release through SFTP.

## Release Contents

Included in the deployed release:

- `app/`
- `modules/`
- `plugins/`
- `var/config/`
- `www/index.php`
- `www/.htaccess`
- `www/dist/`
- `application.init.php`
- `project.xml`

Excluded by the workflow:

- `.git/`
- `.github/`
- `.vscode/`
- `docs/`
- `frontend/`
- `node_modules/`
- `composer.json`
- `composer.lock`
- runtime files under `var/cache`, `var/log`, `var/sessions`, `var/temp`, and `var/meteo-cache`
- `.env` and `.env.*`

## Angular Build Output Requirement

Angular must emit `index.html` directly into `www/dist`, not into `www/dist/browser`.

Current `frontend/angular.json` configuration:

```json
"outputPath": {
  "base": "../www/dist",
  "browser": ""
}
```

This is required because `www/.htaccess` serves `www/dist/index.html` as the SPA fallback.

## Apache Responsibilities

`www/.htaccess` must continue to handle:

- canonical production redirects
- `/api` routing to Jelix
- SPA fallback to `dist/index.html`
- compatibility with the local MAMP path
- compatibility with the production OVH root

## Post-Deployment Checks

Application response:

```bash
curl -I 'https://meteo360.zeffyr.com/'
```

API response:

```bash
curl 'https://meteo360.zeffyr.com/api'
curl 'https://meteo360.zeffyr.com/api/places?q=Paris&limit=5'
```

Canonical redirects:

```bash
curl -I 'http://meteo360.zeffyr.com/'
curl -I 'https://www.meteo360.zeffyr.com/'
curl -I 'http://www.meteo360.zeffyr.com/'
```

Each variant should return `301` to `https://meteo360.zeffyr.com/`.

## Do Not Introduce Without Explicit Scope Change

- Docker-based deployment
- SSH key deployment flow
- database provisioning or SQL migrations
- hardcoded secrets in the repository
- direct Open-Meteo requests from Angular
