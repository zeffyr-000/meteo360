# Frontend Workspace - Meteo360

This directory contains the Angular 21 frontend for Meteo360.

Use the root documentation suite as the primary source of truth:

- `../README.md` for the project overview
- `../docs/SETUP.md` for local setup and proxy behavior
- `../docs/ARCHITECTURE.md` for frontend/backend boundaries
- `../docs/TESTING.md` for test and validation commands
- `../docs/I18N.md` for Transloco rules

## Commands

Run all frontend commands from this directory:

```bash
npm start
npm run build:prod
npm test -- --watch=false
```

## Project-Specific Notes

- Development uses the proxy defined in `proxy.conf.json`.
- The frontend must keep calling relative `/api` endpoints.
- Production builds are emitted to `../www/dist`.
- User-facing text must go through Transloco.
