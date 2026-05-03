# Deploiement - Meteo360

Meteo360 est deploye sur OVH via GitHub Actions et SFTP/password. Le deploiement ne repose pas sur Docker et ne necessite pas de base de donnees pour le MVP.

## URL De Production

URL canonique:

```text
https://meteo360.zeffyr.com/
```

Les variantes suivantes doivent rediriger en permanent redirect 301 vers l'URL canonique:

```text
http://meteo360.zeffyr.com/
https://www.meteo360.zeffyr.com/
http://www.meteo360.zeffyr.com/
```

Les chemins sont conserves:

```text
http://www.meteo360.zeffyr.com/api/places?q=Paris
-> https://meteo360.zeffyr.com/api/places?q=Paris
```

## Racine Web OVH

Le depot complet doit etre deploye sur OVH, mais le domaine doit pointer vers le sous-dossier public:

```text
<dossier-projet>/www/
```

Le frontend production est servi depuis:

```text
www/dist/
```

Le backend Jelix est servi par:

```text
www/index.php
```

## GitHub Actions

Workflow CI:

```text
.github/workflows/ci.yml
```

Workflow deploiement:

```text
.github/workflows/deploy-prod.yml
```

Declencheurs de production:

- push sur `main`
- declenchement manuel `workflow_dispatch`

## Secrets Requis

```text
OVH_SFTP_HOST
OVH_SFTP_PORT
OVH_SFTP_USER
OVH_SFTP_PASSWORD
OVH_SFTP_REMOTE_DIR
```

Valeurs connues pour le projet:

```text
OVH_SFTP_HOST=ssh.cluster103.hosting.ovh.net
OVH_SFTP_PORT=22
OVH_SFTP_USER=zeffyr-meteo360
OVH_SFTP_REMOTE_DIR=/
```

Le mot de passe SFTP doit etre stocke uniquement dans le secret GitHub `OVH_SFTP_PASSWORD`.

`OVH_SFTP_REMOTE_DIR=/` est volontaire: le compte SFTP pointe deja vers le dossier projet Meteo360.

## Pipeline De Production

Le workflow effectue:

1. Checkout du depot.
2. Installation Node.js 22.
3. `npm ci` dans `frontend/`.
4. Lint frontend.
5. Tests frontend.
6. Build production Angular.
7. Installation PHP 7.4 dans l'environnement CI pour verifier la compatibilite backend documentee.
8. Lint syntaxique PHP.
9. Preparation du repertoire `release`.
10. Upload SFTP avec `lftp`.

## Contenu De La Release

Inclus:

- `app/`
- `modules/`
- `plugins/`
- `var/config/`
- `www/index.php`
- `www/.htaccess`
- `www/dist/`
- `application.init.php`
- `project.xml`

Exclus:

- `.git/`
- `.github/`
- `.vscode/`
- `docs/`
- `frontend/`
- `node_modules/`
- fichiers runtime dans `var/cache`, `var/log`, `var/sessions`, `var/temp`, `var/meteo-cache`
- `.env` et `.env.*`

## Angular Build Output

Angular doit produire `index.html` directement dans `www/dist`, pas dans `www/dist/browser`.

Configuration attendue dans `frontend/angular.json`:

```json
"outputPath": {
  "base": "../www/dist",
  "browser": ""
}
```

Cette configuration est importante parce que `.htaccess` sert `www/dist/index.html`.

## Configuration Apache

`www/.htaccess` doit assurer:

- redirect canonique production
- routage `/api` vers Jelix
- fallback Angular vers `dist/index.html`
- compatibilite locale `http://localhost:8888/meteo360/www/`
- compatibilite production `https://meteo360.zeffyr.com/`

## Verification Apres Deploiement

Tester l'application:

```bash
curl -I 'https://meteo360.zeffyr.com/'
```

Tester l'API:

```bash
curl 'https://meteo360.zeffyr.com/api'
curl 'https://meteo360.zeffyr.com/api/places?q=Paris&limit=5'
```

Tester les redirections:

```bash
curl -I 'http://meteo360.zeffyr.com/'
curl -I 'https://www.meteo360.zeffyr.com/'
curl -I 'http://www.meteo360.zeffyr.com/'
```

Chaque variante doit renvoyer `301` vers `https://meteo360.zeffyr.com/`.

## Points A Ne Pas Introduire Sans Demande

- Docker
- deploiement par cle SSH
- base de donnees
- migrations SQL
- secrets en dur dans le depot
- exposition directe d'Open-Meteo depuis Angular
