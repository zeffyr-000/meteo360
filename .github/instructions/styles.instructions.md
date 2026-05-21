---
description: "Use when editing Meteo360 SCSS files. Covers token reuse, brutalist radius token system (2/4/6px), atmospheric dashboard styling, responsive breakpoints, and mobile-safe layout rules."
applyTo:
  - "frontend/src/**/*.scss"
  - "frontend/src/styles.scss"
---
# Meteo360 Styling Rules

- Reuse the existing Meteo360 tokens from `frontend/src/styles.scss`.
- Use the brutalist radius token system: `--meteo-radius-block` (2px), `--meteo-radius-card` (4px), `--meteo-radius-panel` (6px), `--meteo-radius-pill` (999px). The old 8px radius convention no longer applies.
- Preserve the atmospheric dashboard feel without turning the UI into a marketing page.
- Keep the main width and responsive structure consistent with the existing shell and grids.
- Respect the current breakpoint system at `1050px`, `760px`, `600px`, and `430px` unless a deliberate layout change is required.
- Prevent text overflow in narrow layouts.
- Prefer small, local styling changes over broad visual rewrites.
