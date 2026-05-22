# Local Setup - Meteo360

This guide describes the local development setup for Meteo360. The project intentionally follows the same local shape used by the validated sibling Jelix projects: Angular runs in `frontend/`, Jelix lives at the repository root, and Apache or MAMP serves the `www/` directory.

## Prerequisites

- macOS with MAMP or another local Apache/PHP setup exposed through `http://localhost:8888/`
- Node.js 22
- npm 10
- PHP 7.4 available locally for Jelix compatibility checks
- Jelix 1.7 installed in the sibling path `../jelix/lib1.7`
- Git

Expected local layout:

```text
/Users/sparkman/www/
+-- jelix/
|   +-- lib1.7/
+-- suiviseries/
+-- suiviseries-api/
+-- meteo360/
```

## Frontend Setup

Install dependencies and start the Angular dev server from `frontend/`:

```bash
cd /Users/sparkman/www/meteo360/frontend
npm ci
npm start
```

Use `npm ci` for the initial install and after every `git pull`: it is deterministic, honours `package-lock.json` strictly, and is significantly faster than `npm install`. Reserve `npm install <pkg>` for explicitly adding or upgrading a dependency.

The repository ships a `frontend/.nvmrc` pinning Node 22. With `nvm` or `fnm` installed, run `nvm use` (or `fnm use`) from `frontend/` to align your local Node version with that pinned version.

If `npm install` ever hangs or fails with `EACCES` / `EINTEGRITY` errors, the npm cache is usually the culprit. Reset it without `sudo`:

```bash
npm cache clean --force
npm cache verify
rm -rf node_modules
npm ci --no-audit --no-fund
```

The dev server runs on:

```text
http://localhost:4200/
```

`npm start` uses the Angular proxy configuration so the frontend can keep calling relative `/api` endpoints.

## Local Backend

The backend is served through the shared local Apache or MAMP root:

```text
http://localhost:8888/
```

Within that shared server, Meteo360 is reachable at:

```text
http://localhost:8888/meteo360/www/
```

Useful direct checks:

```bash
curl 'http://localhost:8888/meteo360/www/api'
curl 'http://localhost:8888/meteo360/www/api/places?q=Paris&limit=5'
curl 'http://localhost:8888/meteo360/www/api/forecast?latitude=48.85341&longitude=2.3488'
```

## Angular Proxy

The frontend must keep calling relative `/api` URLs. In development, `frontend/proxy.conf.json` forwards those requests to the local Jelix application:

```json
{
  "/api/**": {
    "target": "http://localhost:8888/meteo360/www/",
    "secure": false
  }
}
```

If you change the proxy configuration, restart `npm start`. Angular does not reliably hot-reload proxy changes.

## Required Jelix Runtime Files

The following runtime files must remain present for the local and OVH environments:

```text
var/config/installer.ini.php
var/config/localconfig.ini.php
var/config/liveconfig.ini.php
var/config/localurls.xml
```

The `plugins/` directory must also exist because it is declared in `application.init.php`, even when the directory is otherwise empty.

Jelix service selectors are strict. For the Meteo360 weather service, the required mapping is:

```text
jClasses::getService('commun~weather')
-> modules/commun/classes/weather.class.php
-> class weather
```

Do not rename that file or class to a service-style naming scheme.

## Validation Commands

Frontend:

```bash
cd /Users/sparkman/www/meteo360/frontend
npm run build:prod
npm test -- --watch=false
```

Backend PHP syntax with the local MAMP runtime:

```bash
cd /Users/sparkman/www/meteo360
find application.init.php modules app www -name '*.php' -print0 | xargs -0 -n1 /Applications/MAMP/bin/php/php7.4.33/bin/php -l
```

API through the Angular proxy:

```bash
curl 'http://localhost:4200/api/places?q=Paris&limit=5'
```

## Troubleshooting

### `/api` returns `404` through `localhost:4200`

Restart `npm start` after any change to `proxy.conf.json`.

Also verify that the direct API is responding:

```bash
curl 'http://localhost:8888/meteo360/www/api'
```

### Jelix reports a `basePath` issue

Check `app/system/mainconfig.ini.php` and `www/.htaccess`. Meteo360 must stay compatible with both the local MAMP path and the OVH production root.

### `Given plugin dir ... plugins does not exists`

Recreate the `plugins/` directory. It is required by Jelix and should stay versioned.

### `The application is not installed`

Verify that `var/config/installer.ini.php` exists. Jelix expects that runtime file to be present.

### Open-Meteo is not responding

Test the upstream provider directly:

```bash
curl 'https://geocoding-api.open-meteo.com/v1/search?name=Paris&count=5&language=fr&format=json'
```

If the provider responds but `/api/places` fails, investigate the PHP or Jelix layer rather than the network path.
