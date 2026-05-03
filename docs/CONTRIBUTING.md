# Contributing Guide - Meteo360

Ce guide fixe les standards de contribution pour Meteo360. Il reprend l'esprit de `suiviseries`: conventions explicites, code testable, documentation maintenue, et respect de l'architecture existante.

## Workflow Git

- Travailler sur des branches courtes.
- Le mainteneur gere les commits et les pushes manuellement si le travail est fait par assistant.
- Ne pas lancer de `git reset --hard` ou de revert global sans demande explicite.
- Ne pas melanger une feature avec des refactorings non lies.

## Regles Projet

- Pas de Docker.
- Pas de base de donnees pour le MVP.
- Pas d'authentification tant que ce n'est pas demande.
- Pas de secret dans le depot.
- Garder l'API sous `/api`.
- Garder la production sous `https://meteo360.zeffyr.com/`.

## Standards Angular

### Composants

- Utiliser les composants standalone Angular 21.
- Garder `templateUrl` et `styleUrl` separes.
- Utiliser `ChangeDetectionStrategy.OnPush`.
- Utiliser `inject()` plutot que l'injection par constructeur.
- Utiliser `signal()` et `computed()` pour l'etat local.
- Utiliser `takeUntilDestroyed()` pour les subscriptions.
- Garder les membres `protected` quand ils ne servent qu'au template.

### Templates

- Utiliser `@if`, `@for`, `@switch`.
- Ne pas introduire `*ngIf` ou `*ngFor`.
- Utiliser des pipes Angular pour formater dates et nombres.
- Ajouter un `track` stable dans les boucles.
- Eviter les expressions complexes dans les templates.

### Services

- Garder les appels HTTP dans des services Angular.
- Ne pas appeler directement Open-Meteo depuis les composants.
- Garder les URLs API relatives.
- Mapper les reponses API dans les services.

## Standards Jelix

### Classes

Respecter les conventions de selecteurs Jelix:

```text
commun~weather -> modules/commun/classes/weather.class.php -> class weather
```

### Controleurs

- Les controleurs etendent `jController`.
- Les endpoints API renvoient une reponse `json` Jelix.
- Les erreurs fournisseur doivent etre capturees et renvoyees sous forme JSON stable.
- Garder la compatibilite PHP 7.4 locale.

### Configuration

Ne pas supprimer:

```text
plugins/.gitkeep
var/config/installer.ini.php
var/config/localconfig.ini.php
var/config/liveconfig.ini.php
var/config/localurls.xml
```

Ces fichiers/dossiers sont necessaires au fonctionnement local et OVH.

## Internationalisation

Tout texte visible cote Angular doit passer par Transloco:

```html
{{ 'weather.loading_forecast' | transloco }}
```

Les traductions vivent dans:

```text
frontend/src/app/i18n/fr.ts
```

Ne pas ajouter de fichiers JSON de traduction sans demande.

## Material Design

- Preferer les composants Angular Material.
- Utiliser les icones Material existantes.
- Garder une UI dashboard sobre, lisible, dense et responsive.
- Eviter les decorations inutiles.
- Ne pas casser les contraintes mobiles.

## Tests Et Validation

Avant de proposer une PR:

```bash
cd frontend
npm test -- --watch=false
npm run build:prod
```

Puis depuis la racine:

```bash
find application.init.php modules app www -name '*.php' -print0 | xargs -0 -n1 /Applications/MAMP/bin/php/php7.4.33/bin/php -l
```

Tester aussi:

```bash
curl 'http://localhost:4200/api/places?q=Paris&limit=5'
```

## Documentation

Mettre a jour la documentation quand une convention change:

- setup local
- routes API
- deploiement OVH
- proxy Angular
- structure Jelix
- i18n
- tests

Ne pas documenter des fonctionnalites qui n'existent pas encore.
