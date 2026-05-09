---
description: "Use when editing Angular TypeScript files in Meteo360. Covers Angular 21 standalone patterns, Signals, WeatherService boundaries, Transloco integration, and frontend project constraints."
applyTo: "frontend/src/**/*.ts"
---
# Meteo360 Angular TypeScript Rules

- Use `inject()` instead of constructor injection.
- Use `ChangeDetectionStrategy.OnPush` on components.
- Use `signal()` and `computed()` for local UI state.
- Keep `templateUrl` and `styleUrl` in separate files.
- Keep component members `protected` when they are only consumed by templates.
- Keep frontend API calls in `WeatherService` with relative `/api` URLs.
- Do not call Open-Meteo directly from Angular.
- Keep user-facing text behind Transloco keys.
- Prefer concise English comments if a comment is genuinely needed.
