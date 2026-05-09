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
OVH_SFTP_REMOTE_DIR=www/meteo360
```

`OVH_SFTP_REMOTE_DIR` must point to the Meteo360 project directory visible from the current SFTP session. Use a project-specific relative path such as `www/meteo360` when the account sees a broader root. Use `/` only when the SFTP session already opens in the Meteo360 project directory itself, not in a broader OVH hosting home. Dot segments (`.` and `..`), dot-prefixed path segments, and whitespace are rejected by the workflow.

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
10. Validate that the OVH SFTP target is a project directory, not the SFTP root.
11. Prepare a targeted `release/` directory with only deployable paths.
12. Install `lftp`.
13. Run an SFTP preflight to create the project directory if needed, verify the remote target, detect a broader hosting root when `/` is misused, and confirm write access.
14. Upload the release through SFTP using scoped sync operations.

Optional GitHub Actions variable:

- `OVH_STRICT_REMOTE_DIR_VALIDATION=true` to make the preflight fail when `/` looks like an OVH hosting home instead of the Meteo360 project directory. By default, that heuristic emits a warning and continues because it can also match a legitimate first deployment to an empty project root that still contains OVH's default `www/` directory.

## Release Contents

Only these repository paths are copied into the deployed `release/` directory:

- `app/`
- `modules/`
- `plugins/`
- `var/config/`
- `www/index.php`
- `www/.htaccess`
- `www/dist/`
- `application.init.php`
- `project.xml`

Other repository paths are omitted unless the workflow provisions them remotely at runtime.

Not managed by the release artifact:

- runtime directories other than `var/config/`
- `../jelix/temp/meteo360/` because it is outside the deployed project directory

## Runtime Directories

The workflow provisions only the runtime directories that are currently required inside the deployed project directory:

- `var/cache/`
- `var/log/`
- `var/sessions/`

The workflow does not manage:

- `../jelix/temp/meteo360/` because it is outside `OVH_SFTP_REMOTE_DIR`
- `var/temp/` because the current Jelix temp path is outside the deployed project directory
- `var/meteo-cache/` because it is not used by the current application code

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
