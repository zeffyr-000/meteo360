---
description: "Use when editing Angular templates in Meteo360. Covers modern control flow, Transloco usage, Material-based dashboard UI, accessibility, and responsive weather layout constraints."
applyTo: "frontend/src/**/*.html"
---
# Meteo360 Angular Template Rules

- Use `@if`, `@for`, and `@switch`.
- Do not introduce `*ngIf` or `*ngFor`.
- Track repeated items with stable identifiers.
- Keep visible UI text in Transloco.
- Use Material components and existing dashboard patterns before inventing custom markup.
- Keep icon-only actions labeled with translated `aria-label` or tooltips.
- Avoid template complexity when a computed value in TypeScript would be clearer.
- Preserve mobile readability and prevent text overflow in buttons, cards, and metric tiles.
