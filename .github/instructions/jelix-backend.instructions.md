---
description: "Use when editing Meteo360 Jelix backend files, routes, entry points, or hosting config. Covers JSON controller responses, class selector naming, Open-Meteo backend boundaries, OVH compatibility, and PHP 7.4 constraints."
applyTo:
  - "modules/**/*.php"
  - "app/**/*.php"
  - "www/**/*.php"
  - "app/system/**/*.xml"
  - "application.init.php"
  - "www/.htaccess"
---
# Meteo360 Jelix Backend Rules

- Controllers extend `jController` and return Jelix JSON responses.
- Keep backend code compatible with PHP 7.4.
- Respect Jelix selector naming exactly for `commun~weather`.
- Keep provider calls on the backend only.
- Preserve compatibility with both `http://localhost:8888/meteo360/www/` and `https://meteo360.zeffyr.com/`.
- Keep canonical redirects, `/api` routing, and SPA fallback behavior consistent when touching `www/.htaccess`.
- Avoid introducing PHP 8-only syntax or unrelated framework changes.
