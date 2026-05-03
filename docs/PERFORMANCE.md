# Performance - Meteo360

Ce document liste les optimisations et garde-fous de performance du MVP Meteo360.

## Objectifs

- Build Angular production stable.
- Bundle initial sous les budgets definis.
- Fonts servies localement.
- API backend simple et rapide.
- Pas de dependance front directe a Open-Meteo.

## Build Angular

Commande:

```bash
cd frontend
npm run build:prod
```

Sortie attendue:

```text
www/dist/index.html
www/dist/main-*.js
www/dist/styles-*.css
```

Angular 21 doit produire directement dans `www/dist`:

```json
"outputPath": {
  "base": "../www/dist",
  "browser": ""
}
```

## Budgets

Budgets actuels dans `frontend/angular.json`:

```json
{
  "type": "initial",
  "maximumWarning": "1.1MB",
  "maximumError": "1.3MB"
}
```

```json
{
  "type": "anyComponentStyle",
  "maximumWarning": "16kB",
  "maximumError": "20kB"
}
```

Ces budgets tiennent compte de Transloco MessageFormat et Angular Material.

## CommonJS Autorise

Transloco MessageFormat depend de `@messageformat/core`, qui est declare comme dependance CommonJS autorisee:

```json
"allowedCommonJsDependencies": ["@messageformat/core"]
```

Ne pas retirer cette configuration sans remplacer MessageFormat.

## Fonts Et Icones

Roboto est charge localement via `@fontsource/roboto`:

```scss
@import "@fontsource/roboto/300.css";
@import "@fontsource/roboto/400.css";
@import "@fontsource/roboto/500.css";
@import "@fontsource/roboto/700.css";
```

Les icones Material sont chargees via le package `material-icons`:

```scss
@import "material-icons/iconfont/material-icons.css";
```

## Runtime Frontend

Le composant racine utilise:

- Signals pour l'etat local
- `computed()` pour les previews horaires et quotidiennes
- `ChangeDetectionStrategy.OnPush`
- `takeUntilDestroyed()` pour nettoyer les subscriptions

Les calculs de presentation doivent rester derives de l'etat, pas dupliquer les donnees.

## API Backend

Le backend impose:

- timeout HTTP Open-Meteo de 10 secondes
- timeout de connexion de 5 secondes
- normalisation des reponses avant retour au frontend

Les appels fournisseur restent server-side pour:

- garder un contrat API stable cote Angular
- simplifier les futures politiques de cache
- centraliser les erreurs fournisseur

## Fallback Angular

`www/.htaccess` sert `www/dist/index.html` pour les routes non API. Cela permet de garder les routes Angular fonctionnelles en production.

## Axes Futurs

A evaluer uniquement apres le MVP:

- cache backend court pour les recherches de villes
- cache backend court pour les previsions par coordonnees
- lazy loading si l'application gagne plusieurs pages
- audit Lighthouse apres mise en production
- tests E2E Playwright si les workflows deviennent critiques

## Anti-patterns

- appeler Open-Meteo depuis Angular directement
- ajouter des dependances lourdes pour de simples formatages
- stocker de gros payloads en signals si une projection suffit
- introduire une PWA ou service worker avant d'avoir une strategie de cache documentee
