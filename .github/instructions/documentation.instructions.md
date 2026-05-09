---
description: "Use when writing or updating Meteo360 documentation, README files, AGENTS.md, design docs, or AI guidance. Covers English-first, project-specific, reference-oriented documentation standards."
applyTo:
  - "README.md"
  - "docs/**/*.md"
  - "DESIGN_SYSTEM.md"
  - "frontend/README.md"
  - "AGENTS.md"
  - ".github/copilot-instructions.md"
---
# Meteo360 Documentation Rules

- Write documentation in English.
- Keep documentation specific to Meteo360, not generic framework boilerplate.
- Cross-link to the authoritative document for a topic instead of duplicating the same rule in multiple files.
- Keep commands, paths, routes, and file names aligned with the real repository.
- Do not document features that do not exist, especially Docker, authentication, database persistence, Playwright, service workers, or background jobs.
- If the documentation structure changes, update `docs/README.md` and `docs/DOCUMENTATION_STATUS.md` in the same change set.
