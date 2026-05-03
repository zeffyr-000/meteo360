# Pull Request - Meteo360

## Resume

Decrire le changement en quelques lignes.

## Type De Changement

- [ ] Feature
- [ ] Fix
- [ ] Refactor
- [ ] Documentation
- [ ] Configuration / CI / Deploiement
- [ ] Tests

## Checklist Fonctionnelle

- [ ] Le changement respecte le MVP sans base de donnees.
- [ ] Le frontend continue d'appeler l'API via `/api`.
- [ ] Les appels Open-Meteo restent cote backend.
- [ ] Les routes Jelix restent declarees dans `app/system/urls.xml`.
- [ ] Les conventions Jelix `*.class.php` sont respectees.
- [ ] Aucun fichier Docker n'a ete ajoute.

## Checklist Frontend

- [ ] Composants Angular 21 standalone.
- [ ] `ChangeDetectionStrategy.OnPush` conserve pour les composants applicatifs.
- [ ] `inject()` utilise pour les dependances.
- [ ] `@if` / `@for` utilises dans les templates.
- [ ] Textes utilisateur ajoutes dans Transloco.
- [ ] UI responsive verifiee sur mobile et desktop.

## Checklist Backend

- [ ] PHP compatible avec le runtime local 7.4.
- [ ] Reponses API JSON stables.
- [ ] Erreurs fournisseur capturees.
- [ ] Pas de secret ajoute au depot.

## Validations

Coller les commandes executees:

```bash
cd frontend
npm test -- --watch=false
npm run build:prod
```

```bash
find application.init.php modules app www -name '*.php' -print0 | xargs -0 -n1 /Applications/MAMP/bin/php/php7.4.33/bin/php -l
```

```bash
curl 'http://localhost:4200/api/places?q=Paris&limit=5'
```

## Documentation

- [ ] README mis a jour si necessaire.
- [ ] `docs/API.md` mis a jour si endpoint modifie.
- [ ] `docs/DEPLOYMENT.md` mis a jour si deploiement modifie.
- [ ] `.github/copilot-instructions.md` mis a jour si convention projet modifiee.

## Risques Et Notes

Lister les risques, limites, points a verifier en review.
