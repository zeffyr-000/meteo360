# Documentation Index - Meteo360

This file is the entry point for the Meteo360 documentation suite. Use it to find the right document quickly and to keep documentation updates aligned with the codebase.

## Reading Order

1. `README.md` - project overview, quick start, and documentation entry points
2. `docs/SETUP.md` - local environment, proxy, runtime requirements, and troubleshooting
3. `docs/ARCHITECTURE.md` - Angular and Jelix boundaries, data flow, and deployment shape
4. `docs/API.md` - public API contract and request/response expectations
5. `docs/DEPLOYMENT.md` - OVH deployment model, release contents, and post-deploy checks
6. `docs/TESTING.md` - frontend, backend, and manual validation rules
7. `docs/CONTRIBUTING.md` - development standards and documentation maintenance rules
8. `docs/I18N.md` - Transloco setup and localization constraints
9. `docs/MATERIAL-DESIGN.md` - Angular Material usage and layout rules
10. `docs/PERFORMANCE.md` - build budgets and performance guardrails
11. `DESIGN_SYSTEM.md` - visual tokens and UI conventions
12. `docs/DOCUMENTATION_STATUS.md` - quality target, current scope, and maintenance expectations

## AI Guidance

AI guidance is organized in layers:

- `AGENTS.md` - central project guide for AI agents
- `.github/copilot-instructions.md` - concise always-on entrypoint
- `.github/instructions/*.instructions.md` - focused file-scoped instructions by domain

When AI guidance is updated, keep it aligned with the same source-of-truth documents listed above instead of duplicating rules in multiple places.

## Documentation Update Triggers

- Architecture, folder structure, or ownership changes -> update `docs/ARCHITECTURE.md`
- API route, payload, or error contract changes -> update `docs/API.md`
- Local setup, proxy, dependency, or runtime changes -> update `docs/SETUP.md`
- CI, deployment, hosting, or release packaging changes -> update `docs/DEPLOYMENT.md`
- Testing workflow, tooling, or validation command changes -> update `docs/TESTING.md`
- Material, layout, token, or component usage changes -> update `docs/MATERIAL-DESIGN.md` and `DESIGN_SYSTEM.md`
- Transloco or language policy changes -> update `docs/I18N.md`
- Contribution rules or project conventions changes -> update `docs/CONTRIBUTING.md`
- Documentation standards or coverage changes -> update `docs/DOCUMENTATION_STATUS.md`
- Core project framing changes -> update `README.md`

## Quality Rules

- Write documentation in English.
- Keep examples executable against the current repository layout.
- Document only features that actually exist in Meteo360.
- Prefer one authoritative document per topic instead of repeating the same rule across multiple files.
- Update cross-links when files are added, removed, or renamed.