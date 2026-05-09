Read `AGENTS.md` first. It is the main project guide for AI agents and now holds the authoritative architecture, rule, and command set.

This file is intentionally concise and only keeps the rules that should always be in immediate context.

## Quick Facts

- Meteo360 is an Angular 21 frontend plus a Jelix 1.7 backend.
- The public API lives under relative `/api` routes.
- `WeatherService` is the frontend API boundary.
- Open-Meteo is called on the backend only.
- Production runs at `https://meteo360.zeffyr.com/` and OVH must point to `www/`.

## Non-Negotiable Rules

- Do not add Docker, database persistence, authentication, queues, or background jobs unless explicitly requested.
- Keep Angular code aligned with standalone components, `inject()`, `OnPush`, Signals, and modern control flow.
- Keep user-facing Angular text in Transloco.
- Keep PHP backend code compatible with PHP 7.4.
- Respect Jelix class selector naming exactly for `commun~weather`.
- Keep documentation and AI guidance in English.

## Reading Order

1. `AGENTS.md`
2. `docs/README.md`
3. The relevant `docs/*.md` file for the topic you are touching
4. The matching `.github/instructions/*.instructions.md` file for the files in scope
