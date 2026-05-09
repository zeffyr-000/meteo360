---
description: "Use when editing Meteo360 SCSS files. Covers token reuse, 8px radius language, atmospheric dashboard styling, responsive breakpoints, and mobile-safe layout rules."
applyTo:
  - "frontend/src/**/*.scss"
  - "frontend/src/styles.scss"
---
# Meteo360 Styling Rules

- Reuse the existing Meteo360 tokens from `frontend/src/styles.scss`.
- Keep the 8px radius system consistent across cards, controls, and panels.
- Preserve the atmospheric dashboard feel without turning the UI into a marketing page.
- Keep the main width and responsive structure consistent with the existing shell and grids.
- Respect the current breakpoint system at `1050px`, `760px`, `640px`, and `430px` unless a deliberate layout change is required.
- Prevent text overflow in narrow layouts.
- Prefer small, local styling changes over broad visual rewrites.
