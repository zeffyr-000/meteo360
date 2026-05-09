# Documentation Status - Meteo360

This file tracks the documentation standard for Meteo360 and defines what must stay accurate as the project evolves.

## Target Standard

Meteo360 documentation is being aligned with the already-approved sibling repositories used by the same teams.

The target standard is:

- English-first documentation for international collaboration
- focused, project-specific content instead of generated boilerplate
- one authoritative document per topic
- commands, paths, and examples that match the real repository
- AI guidance kept consistent with the documentation suite

## Active Documentation Surface

| Document                          | Status | Purpose |
| --------------------------------- | ------ | ------- |
| `README.md`                       | Active | Project overview, quick start, and documentation entry point |
| `docs/README.md`                  | Active | Documentation index and update triggers |
| `AGENTS.md`                       | Active | Central AI guide and project-level agent rules |
| `.github/copilot-instructions.md` | Active | Current project-level AI guidance |
| `.github/instructions/*.instructions.md` | Active | File-scoped AI guidance for documentation, Angular, styles, backend, and workflows |
| `docs/SETUP.md`                   | Active | Local environment, proxy setup, runtime requirements, troubleshooting |
| `docs/ARCHITECTURE.md`            | Active | Angular and Jelix architecture, runtime boundaries, deployment shape |
| `docs/API.md`                     | Active | Public `/api` contract and endpoint behavior |
| `docs/DEPLOYMENT.md`              | Active | OVH deployment model, release packaging, redirects, and checks |
| `docs/TESTING.md`                 | Active | Validation commands, testing rules, and manual API checks |
| `docs/CONTRIBUTING.md`            | Active | Development standards and documentation maintenance rules |
| `docs/MATERIAL-DESIGN.md`         | Active | Angular Material usage and layout conventions |
| `docs/I18N.md`                    | Active | Transloco setup and localization constraints |
| `docs/PERFORMANCE.md`             | Active | Build budgets, runtime guardrails, and optimization limits |
| `DESIGN_SYSTEM.md`                | Active | Project tokens, visual conventions, and UI patterns |

## Documentation Quality Rules

- All project documentation in scope must be written in English.
- Keep wording factual and specific to Meteo360.
- Do not document features that are not implemented.
- Prefer cross-linking to the authoritative document instead of duplicating the same guidance.
- Keep command examples runnable from the paths shown in the repository.
- Update the documentation in the same change set when a documented rule changes.

## Documentation Update Triggers

- Architecture or folder structure changes -> update `docs/ARCHITECTURE.md`
- API route or payload changes -> update `docs/API.md`
- Local setup or proxy changes -> update `docs/SETUP.md`
- CI, deployment, hosting, or release packaging changes -> update `docs/DEPLOYMENT.md`
- Test tooling or validation command changes -> update `docs/TESTING.md`
- Material, layout, or token changes -> update `docs/MATERIAL-DESIGN.md` and `DESIGN_SYSTEM.md`
- Transloco or language policy changes -> update `docs/I18N.md`
- Contribution rules or shared conventions changes -> update `docs/CONTRIBUTING.md`
- Documentation structure or coverage changes -> update `docs/README.md` and this file
- AI guidance changes -> update `AGENTS.md`, `.github/copilot-instructions.md`, and relevant `.github/instructions/*.instructions.md`

## AI Guidance Expectations

AI guidance is part of the project documentation surface.

It must:

- follow the same English-first standard
- stay aligned with the real Angular, Jelix, and deployment architecture
- avoid speculative rules copied from sibling projects when Meteo360 does not implement the related feature
- point back to authoritative project documents when a rule belongs in documentation rather than prompt text

## Out Of Scope Until Implemented

Do not document the following topics as active Meteo360 features until they exist in the codebase:

- authentication
- database persistence
- user accounts
- PWA or service worker support
- push notifications
- Playwright end-to-end tests
- persistent backend cache
- Docker-based setup or deployment

## Validation Baseline

The documentation suite should stay compatible with these project checks:

```bash
cd frontend
npm run build:prod
npm test -- --watch=false
```

```bash
curl 'http://localhost:4200/api/places?q=Paris&limit=5'
```

```bash
find application.init.php modules app www -name '*.php' -print0 | xargs -0 -n1 /Applications/MAMP/bin/php/php7.4.33/bin/php -l
```
