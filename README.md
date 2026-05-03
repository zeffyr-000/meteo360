# Meteo360

Meteo360 est une application web meteo construite avec un frontend Angular 21 et une API Jelix 1.7. Le MVP ne depend d'aucune base de donnees: l'API backend interroge Open-Meteo, normalise les reponses, puis le frontend consomme des endpoints relatifs sous `/api`.

Application de production: [https://meteo360.zeffyr.com/](https://meteo360.zeffyr.com/)

## Stack

- Angular 21, composants standalone, Signals, `inject()`, `ChangeDetectionStrategy.OnPush`
- Angular Material 21 avec theme Material Design 3
- Transloco et Transloco MessageFormat, sur le meme modele que `suiviseries`
- Jelix 1.7 pour l'API PHP classique
- Open-Meteo pour la geocodification et les previsions
- GitHub Actions pour CI et deploiement OVH via SFTP

## Fonctionnalites MVP

- Recherche de villes via Open-Meteo Geocoding
- Selection d'un lieu et recuperation des previsions meteo
- Meteo actuelle: temperature, ressenti, humidite, vent, precipitation
- Apercu horaire des prochaines heures
- Previsions quotidiennes sur 7 jours
- Interface responsive Material Design
- Routes API meme domaine en production sous `/api`
- Redirection canonique permanente vers `https://meteo360.zeffyr.com/`

## Architecture

Le depot reprend la forme de `suiviseries-api`: Jelix vit a la racine et le repertoire public est `www/`. Le frontend Angular vit dans `frontend/` et son build de production est genere dans `www/dist`.

```text
meteo360/
+-- app/                 # Configuration Jelix
+-- frontend/            # Application Angular 21
+-- modules/             # Modules Jelix
|   +-- commun/          # Controleurs API et service meteo
+-- plugins/             # Plugins Jelix declares, dossier requis meme vide
+-- var/                 # Config runtime, logs, sessions, cache
+-- www/                 # Racine web publique
    +-- index.php        # Point d'entree Jelix
    +-- .htaccess        # Routage API, fallback Angular, redirects prod
    +-- dist/            # Build Angular production
```

Documentation detaillee: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Demarrage Local

Pre-requis:

- Node.js 22
- npm 10
- MAMP ou Apache/PHP local expose sur `http://localhost:8888/`
- Jelix installe dans le repertoire voisin `../jelix/lib1.7`

Installation frontend:

```bash
cd frontend
npm install
npm start
```

L'application Angular est disponible sur `http://localhost:4200/`.

Le proxy Angular suit le meme principe que `suiviseries`: les appels `/api/**` sont transmis a `http://localhost:8888/meteo360/www/`.

Verification API directe:

```bash
curl 'http://localhost:8888/meteo360/www/api'
curl 'http://localhost:8888/meteo360/www/api/places?q=Paris&limit=5'
```

Guide complet: [docs/SETUP.md](docs/SETUP.md)

## API

Endpoints publics du MVP:

```text
GET /api
GET /api/places?q=Paris&limit=5
GET /api/forecast?latitude=48.85341&longitude=2.3488
```

L'API renvoie toujours du JSON et ajoute les entetes CORS utiles au developpement local.

Specification detaillee: [docs/API.md](docs/API.md)

## Internationalisation

Meteo360 utilise Transloco exactement comme `suiviseries`:

- loader inline `TranslocoInlineLoader` dans `frontend/src/app/app.config.ts`
- traductions TypeScript dans `frontend/src/app/i18n/fr.ts`
- imports `TranslocoModule` dans les composants standalone
- helper de test `getTranslocoTestingModule()`

Guide: [docs/I18N.md](docs/I18N.md)

## Qualite

Commandes principales:

```bash
cd frontend
npm run build:prod
npm test -- --watch=false
```

Validation PHP locale avec MAMP:

```bash
cd /Users/sparkman/www/meteo360
find application.init.php modules app www -name '*.php' -print0 | xargs -0 -n1 /Applications/MAMP/bin/php/php7.4.33/bin/php -l
```

Documentation qualite:

- [docs/TESTING.md](docs/TESTING.md)
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
- [docs/PERFORMANCE.md](docs/PERFORMANCE.md)

## Deploiement

Le deploiement de production est automatise par `.github/workflows/deploy-prod.yml` sur `main` et via `workflow_dispatch`.

Secrets GitHub Actions requis:

```text
OVH_SFTP_HOST
OVH_SFTP_PORT
OVH_SFTP_USER
OVH_SFTP_PASSWORD
OVH_SFTP_REMOTE_DIR
```

Pour le compte SFTP actuel `zeffyr-meteo360`, le compte pointe directement vers le dossier projet OVH. La valeur attendue est donc:

```text
OVH_SFTP_REMOTE_DIR=/
```

La racine documentaire du domaine OVH doit pointer vers le sous-dossier `www/` du projet deploye.

Guide complet: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## Documentation

- [docs/SETUP.md](docs/SETUP.md) - Installation locale et troubleshooting
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Architecture frontend/backend
- [docs/API.md](docs/API.md) - Specification des endpoints
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Deploiement OVH et redirects
- [docs/TESTING.md](docs/TESTING.md) - Tests Angular, API et PHP
- [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) - Standards de contribution
- [docs/MATERIAL-DESIGN.md](docs/MATERIAL-DESIGN.md) - Usage Angular Material
- [docs/I18N.md](docs/I18N.md) - Transloco et traduction
- [docs/PERFORMANCE.md](docs/PERFORMANCE.md) - Build, budgets et optimisations
- [docs/DOCUMENTATION_STATUS.md](docs/DOCUMENTATION_STATUS.md) - Etat de la documentation
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) - Tokens et guidelines UI

## Contraintes Projet

- Pas de Docker.
- Pas de base de donnees pour le MVP.
- Pas de commit automatique: les commits sont faits manuellement par le mainteneur.
- Le backend Jelix doit rester compatible avec la structure locale `http://localhost:8888/meteo360/www/` et la production `https://meteo360.zeffyr.com/`.
