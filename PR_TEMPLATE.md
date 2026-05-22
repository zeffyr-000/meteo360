# Pull Request - Meteo360

## Summary

Describe the change in a few lines and explain the user-facing or maintenance value.

## Change Type

- [ ] Feature
- [ ] Fix
- [ ] Refactor
- [ ] Documentation
- [ ] Configuration / CI / Deployment
- [ ] Tests
- [ ] Design system / UI polish

## Scope Checklist

- [ ] The change stays within the Meteo360 MVP scope.
- [ ] No Docker, database persistence, authentication, queues, background jobs, service worker, or Playwright setup was added.
- [ ] Angular still calls the public API through relative `/api` routes.
- [ ] Open-Meteo calls remain on the Jelix backend.
- [ ] Jelix routes remain declared in `app/system/urls.xml` when backend routes change.
- [ ] Jelix `*.class.php` naming conventions remain compatible with PHP 7.4.
- [ ] No secret or environment-specific credential was added to the repository.

## Frontend Checklist

- [ ] Components use Angular standalone patterns.
- [ ] `ChangeDetectionStrategy.OnPush` is preserved for application components.
- [ ] `inject()` is used for dependency injection.
- [ ] Templates use `@if`, `@for`, and `@switch` instead of legacy structural directives.
- [ ] User-facing text goes through Transloco.
- [ ] The `WeatherService` boundary remains the only frontend API caller.

## Design And Accessibility Checklist

- [ ] UI changes follow `DESIGN_SYSTEM.md` and `docs/MATERIAL-DESIGN.md`.
- [ ] SCSS uses existing tokens for radius, borders, shadows, motion, and colors where possible.
- [ ] Icon-only actions have translated labels or tooltips.
- [ ] Focus states remain visible.
- [ ] Selected, live, warning, and error states are not communicated by color alone.
- [ ] Mobile behavior was checked at the relevant breakpoints: `1050px`, `760px`, `600px`, `430px`.
- [ ] Text does not overflow buttons, tags, metric tiles, or timeline slots.
- [ ] Animations still make sense with reduced motion enabled.

## Backend Checklist

- [ ] PHP remains compatible with PHP 7.4.
- [ ] JSON API responses stay stable or are documented in `docs/API.md`.
- [ ] Provider errors are captured and normalized before reaching Angular.
- [ ] Backend changes do not expose provider-specific details to Angular components.

## Validation

Paste the commands that were run:

```bash
cd frontend
npm run lint
npm test -- --watch=false
npm run build:prod
```

```bash
find application.init.php modules app www -name '*.php' -print0 | xargs -0 -n1 /Applications/MAMP/bin/php/php7.4.33/bin/php -l
```

Optional local API checks:

```bash
curl 'http://localhost:8888/meteo360/www/api'
curl 'http://localhost:4200/api/places?q=Paris&limit=5'
```

## Documentation

- [ ] `README.md` was updated if project framing changed.
- [ ] `docs/API.md` was updated if endpoints, payloads, or errors changed.
- [ ] `docs/DEPLOYMENT.md` was updated if deployment changed.
- [ ] `docs/TESTING.md` was updated if validation changed.
- [ ] `docs/MATERIAL-DESIGN.md` and `DESIGN_SYSTEM.md` were updated if UI tokens or design rules changed.
- [ ] AI guidance was updated if project conventions changed.

## Risks And Notes

List known limits, review focus areas, manual checks, and any follow-up work.
