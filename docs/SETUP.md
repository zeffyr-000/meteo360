# Setup Local - Meteo360

Ce guide decrit l'installation locale de Meteo360. Il est volontairement proche du fonctionnement de `suiviseries` pour le frontend et de `suiviseries-api` pour le backend Jelix.

## Prerequis

- macOS avec MAMP ou Apache local expose sur `http://localhost:8888/`
- Node.js 22
- npm 10
- PHP 7.4 via MAMP pour le local
- Jelix 1.7 installe dans le repertoire voisin `../jelix/lib1.7`
- Git

Arborescence locale attendue:

```text
/Users/sparkman/www/
+-- jelix/
|   +-- lib1.7/
+-- suiviseries/
+-- suiviseries-api/
+-- meteo360/
```

## Installation Frontend

```bash
cd /Users/sparkman/www/meteo360/frontend
npm install
npm start
```

L'application Angular demarre sur:

```text
http://localhost:4200/
```

Le script `npm start` lance:

```bash
ng serve --proxy-config proxy.conf.json
```

## Backend Local

Le backend est servi par Apache/MAMP depuis la racine globale:

```text
http://localhost:8888/
```

Comme plusieurs projets partagent ce serveur local, Meteo360 est accessible sous:

```text
http://localhost:8888/meteo360/www/
```

Endpoints utiles:

```bash
curl 'http://localhost:8888/meteo360/www/api'
curl 'http://localhost:8888/meteo360/www/api/places?q=Paris&limit=5'
curl 'http://localhost:8888/meteo360/www/api/forecast?latitude=48.85341&longitude=2.3488'
```

## Proxy Angular

Le frontend appelle toujours `/api` en relatif. En developpement, Angular transmet ces appels a MAMP via `frontend/proxy.conf.json`:

```json
{
  "/api/**": {
    "target": "http://localhost:8888/meteo360/www/",
    "secure": false
  }
}
```

Apres toute modification du proxy, redemarrer `npm start`. Angular ne recharge pas toujours la configuration proxy a chaud.

## Configuration Jelix Requise

Meteo360 reprend les fichiers runtime attendus par Jelix:

```text
var/config/installer.ini.php
var/config/localconfig.ini.php
var/config/liveconfig.ini.php
var/config/localurls.xml
```

Le dossier `plugins/` doit exister car il est declare dans `application.init.php`.

La convention de service Jelix est stricte:

```text
jClasses::getService('commun~weather')
-> modules/commun/classes/weather.class.php
-> class weather
```

## Commandes De Validation

Frontend:

```bash
cd /Users/sparkman/www/meteo360/frontend
npm run build:prod
npm test -- --watch=false
```

Backend PHP avec MAMP:

```bash
cd /Users/sparkman/www/meteo360
find application.init.php modules app www -name '*.php' -print0 | xargs -0 -n1 /Applications/MAMP/bin/php/php7.4.33/bin/php -l
```

API via Angular:

```bash
curl 'http://localhost:4200/api/places?q=Paris&limit=5'
```

## Depannage

### `/api` retourne 404 via `localhost:4200`

Verifier que `npm start` a ete relance apres modification de `proxy.conf.json`.

Verifier aussi que l'API directe repond:

```bash
curl 'http://localhost:8888/meteo360/www/api'
```

### `/api` retourne une erreur Jelix `basePath`

Verifier `app/system/mainconfig.ini.php`. Le projet doit rester compatible local et OVH; ne pas figer un `basePath` qui casserait l'un des deux environnements sans validation.

### Erreur `Given plugin dir ... plugins does not exists`

Creer le dossier `plugins/`. Il doit rester versionne avec `.gitkeep`.

### Erreur `The application is not installed`

Verifier que `var/config/installer.ini.php` existe. Ce fichier est necessaire comme dans `suiviseries-api`.

### Open-Meteo ne repond pas

Tester le fournisseur directement:

```bash
curl 'https://geocoding-api.open-meteo.com/v1/search?name=Paris&count=5&language=fr&format=json'
```

Si ce test passe mais `/api/places` echoue, chercher cote PHP/Jelix, pas cote reseau.
