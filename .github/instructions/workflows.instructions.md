---
description: "Use when editing Meteo360 GitHub Actions workflows or deployment automation. Covers Node 22, PHP 7.4 validation, frontend working-directory rules, release packaging, and OVH SFTP deployment constraints."
applyTo: ".github/workflows/**"
---
# Meteo360 Workflow Rules

- Frontend workflow steps should run from `frontend/`.
- CI must keep validating lint, unit tests, and production build for the frontend.
- Backend validation should keep checking PHP syntax with PHP 7.4.
- Do not introduce Docker-based or SSH-key deployment flows unless explicitly requested.
- Keep release packaging aligned with the current OVH deployment model through `www/`.
- Do not accidentally deploy development-only folders such as `docs/`, `frontend/`, or `node_modules/`.