# Testing Guide - Meteo360

Ce guide documente les validations attendues pour Meteo360. Le projet est volontairement leger au MVP, mais les tests doivent rester fiables et rapides.

## Framework Frontend

Meteo360 utilise le builder Angular `@angular/build:unit-test`, avec Vitest comme moteur de test.

Important:

- Ne pas utiliser Jasmine/Karma.
- Utiliser les helpers Vitest (`vi.fn`, `vi.spyOn`, `vi.restoreAllMocks`).
- Ne jamais appeler Open-Meteo depuis un test unitaire.

## Commandes

Depuis `frontend/`:

```bash
npm test -- --watch=false
npm run build:prod
```

Depuis la racine pour PHP local avec MAMP:

```bash
find application.init.php modules app www -name '*.php' -print0 | xargs -0 -n1 /Applications/MAMP/bin/php/php7.4.33/bin/php -l
```

## Tests De Composants Angular

Le composant racine importe Transloco. Les tests doivent donc toujours inclure:

```typescript
import { getTranslocoTestingModule } from "./testing/transloco-testing.module";
```

Exemple:

```typescript
await TestBed.configureTestingModule({
  imports: [App, getTranslocoTestingModule()],
  providers: [{ provide: WeatherService, useValue: weatherServiceMock }],
}).compileComponents();
```

## Mocks Vitest

Utiliser Vitest:

```typescript
import { vi } from "vitest";

const weatherServiceMock = {
  searchPlaces: vi.fn(),
  getForecast: vi.fn(),
};

afterEach(() => {
  vi.restoreAllMocks();
});
```

Eviter les patterns Jasmine:

```typescript
jasmine.createSpyObj();
spy.and.returnValue();
spy.calls.reset();
```

## Transloco Testing

Le helper central est:

```text
frontend/src/app/testing/transloco-testing.module.ts
```

Regles:

- Ne pas re-ecrire `TranslocoTestingModule.forRoot()` inline dans chaque spec.
- Importer `getTranslocoTestingModule()`.
- Garder les traductions de test synchronisees avec `src/app/i18n/fr.ts`.

## Services HTTP

Pour des tests futurs de `WeatherService`, utiliser `provideHttpClientTesting()` et verifier les URLs relatives:

```typescript
const req = httpMock.expectOne("/api/places?q=Paris&limit=5");
expect(req.request.method).toBe("GET");
```

Ne pas tester contre `http://localhost:8888` dans un test unitaire Angular.

## Tests API Manuels

Les endpoints peuvent etre verifies avec `curl`:

```bash
curl 'http://localhost:8888/meteo360/www/api'
curl 'http://localhost:8888/meteo360/www/api/places?q=Paris&limit=5'
curl 'http://localhost:8888/meteo360/www/api/forecast?latitude=48.85341&longitude=2.3488'
```

Via Angular:

```bash
curl 'http://localhost:4200/api/places?q=Paris&limit=5'
```

## Tests De Routage Apache

Tester les redirects canonique avec un header Host local:

```bash
curl -I -H 'Host: meteo360.zeffyr.com' 'http://localhost:8888/meteo360/www/api'
curl -I -H 'Host: www.meteo360.zeffyr.com' 'http://localhost:8888/meteo360/www/api'
```

Le resultat attendu est un `301` vers `https://meteo360.zeffyr.com/api`.

## Checklist Avant PR

- `npm test -- --watch=false` passe.
- `npm run build:prod` passe.
- Le build produit `www/dist/index.html`.
- Le lint syntaxique PHP passe.
- `/api/places?q=Paris&limit=5` repond 200 en local.
- Aucun endpoint Open-Meteo n'est appele directement depuis Angular.
- Les nouveaux textes UI passent par Transloco.
- La documentation est mise a jour si une convention change.
