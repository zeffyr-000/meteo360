# Architecture Technique - Meteo360

Meteo360 combine une application Angular 21 et une API Jelix 1.7 dans un depot unique. Le projet est volontairement simple pour le MVP: aucune base de donnees, aucune authentification persistante, et aucune couche Docker.

## Objectifs D'Architecture

- Garder le frontend et le backend deployables ensemble sur OVH.
- Utiliser des URLs relatives `/api` pour eviter les problemes CORS en production.
- Reprendre la structure locale qui fonctionne deja avec `suiviseries` et `suiviseries-api`.
- Isoler les appels Open-Meteo dans le backend.
- Garder l'UI Angular reactive, testable et facile a faire evoluer.

## Vue D'Ensemble

```text
Angular 21 UI
    |
    | HTTP relatif /api/*
    v
Angular dev proxy en local
    |
    | http://localhost:8888/meteo360/www/
    v
Apache/MAMP ou OVH
    |
    v
www/.htaccess
    |
    | /api/* -> www/index.php/api/*
    v
Jelix controller commun~default
    |
    v
Jelix service commun~weather
    |
    v
Open-Meteo APIs
```

## Structure Du Depot

```text
meteo360/
+-- app/
|   +-- system/
|       +-- mainconfig.ini.php
|       +-- framework.ini.php
|       +-- urls.xml
|       +-- index/config.ini.php
+-- frontend/
|   +-- src/app/
|   +-- proxy.conf.json
|   +-- angular.json
+-- modules/
|   +-- commun/
|       +-- controllers/default.classic.php
|       +-- classes/weather.class.php
+-- plugins/
+-- var/
|   +-- config/
|   +-- log/
|   +-- sessions/
|   +-- temp/
+-- www/
    +-- .htaccess
    +-- index.php
    +-- dist/
```

## Frontend Angular

### Stack

- Angular 21
- TypeScript 5.9
- Angular Material 21
- RxJS 7.8
- Signals Angular
- Transloco + Transloco MessageFormat
- Vitest via Angular unit-test builder

### Composant Racine

Le composant `App` dans `frontend/src/app/app.ts` porte le MVP:

- `searchControl` pour la ville recherchee
- `places` pour les resultats geocodes
- `selectedPlace` pour la ville active
- `forecast` pour les previsions
- `loadingPlaces`, `loadingForecast`, `error` pour les etats UI
- `dailyPreview` et `hourlyPreview` comme `computed()`

### Service HTTP Frontend

`frontend/src/app/services/weather.service.ts` est la frontiere API Angular.

Regles:

- Garder `apiBaseUrl = '/api'`.
- Ne pas mettre d'URL OVH ou MAMP directement dans les composants.
- Mapper les enveloppes API vers les modeles TypeScript.
- Laisser le composant gerer l'affichage des etats d'erreur et chargement.

## Internationalisation

Meteo360 suit le meme modele que `suiviseries`:

- traductions TypeScript dans `frontend/src/app/i18n/fr.ts`
- loader inline dans `frontend/src/app/app.config.ts`
- `TranslocoModule` importe dans les composants
- helper de test dans `frontend/src/app/testing/transloco-testing.module.ts`

Aucun fichier JSON de traduction n'est attendu pour le MVP.

## Backend Jelix

### Point D'Entree

`www/index.php` charge:

- les headers de securite
- `application.init.php`
- `jClassicRequest`
- la config `index/config.ini.php`
- le coordinateur Jelix

### Configuration

`application.init.php` initialise Jelix et declare:

- `modules/`
- `plugins/`
- le temp base path dans `../jelix/temp/meteo360/`

`app/system/urls.xml` declare les routes significatives:

```text
/api          -> default:index
/api/places   -> default:places
/api/forecast -> default:forecast
```

### Conventions Jelix

Les selecteurs Jelix imposent le nom du fichier et de la classe:

```text
jClasses::getService('commun~weather')
modules/commun/classes/weather.class.php
class weather
```

Ne pas utiliser des noms de type `weather.service.php` pour les classes chargees par `jClasses`.

## Routage Apache

`www/.htaccess` gere trois responsabilites:

- redirections permanentes vers le domaine canonique en production
- routage `/api` vers Jelix
- fallback Angular vers `www/dist/index.html`

Le fichier doit rester compatible avec:

```text
Local:      http://localhost:8888/meteo360/www/
Production: https://meteo360.zeffyr.com/
```

## Donnees Et Fournisseur Meteo

Open-Meteo est appele uniquement cote backend:

- `https://geocoding-api.open-meteo.com/v1/search`
- `https://api.open-meteo.com/v1/forecast`

Le frontend ne doit pas dependre directement des structures Open-Meteo brutes. Le backend renvoie une structure stable adaptee a l'application.

## CI Et Deploiement

CI:

- lint frontend
- tests Angular
- build production Angular
- lint syntaxique PHP

Deploiement:

- declenche sur `main` ou manuellement
- construit `frontend`
- prepare un repertoire `release`
- envoie vers OVH via SFTP/password avec `lftp`

## Decisions Importantes

- Le MVP reste sans base de donnees.
- Le backend reste compatible PHP 7.4 localement.
- Le build Angular sort directement dans `www/dist`, sans sous-dossier `browser`.
- Les commits sont faits manuellement par le mainteneur.
