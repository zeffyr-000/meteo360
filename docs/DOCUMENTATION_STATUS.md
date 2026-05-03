# Documentation Status - Meteo360

Ce fichier suit l'etat de la documentation du projet, dans le meme esprit que `suiviseries`.

## Documentation Active

| Document                          | Statut   | Role                                               |
| --------------------------------- | -------- | -------------------------------------------------- |
| `README.md`                       | Complete | Vue d'ensemble, stack, demarrage, liens docs       |
| `.github/copilot-instructions.md` | Complete | Instructions projet pour GitHub Copilot            |
| `docs/SETUP.md`                   | Complete | Installation locale et depannage                   |
| `docs/ARCHITECTURE.md`            | Complete | Architecture Angular/Jelix et decisions techniques |
| `docs/API.md`                     | Complete | Specification endpoints `/api`                     |
| `docs/DEPLOYMENT.md`              | Complete | Deploiement OVH SFTP et redirects                  |
| `docs/TESTING.md`                 | Complete | Tests Angular, PHP et verifications API            |
| `docs/CONTRIBUTING.md`            | Complete | Standards de contribution                          |
| `docs/MATERIAL-DESIGN.md`         | Complete | Usage Angular Material et UI dashboard             |
| `docs/I18N.md`                    | Complete | Transloco inline comme `suiviseries`               |
| `docs/PERFORMANCE.md`             | Complete | Build, budgets et optimisations                    |
| `DESIGN_SYSTEM.md`                | Complete | Tokens UI et conventions visuelles                 |
| `PR_TEMPLATE.md`                  | Complete | Checklist de pull request                          |

## Principes De Maintenance

- Toute evolution de l'architecture doit mettre a jour `docs/ARCHITECTURE.md`.
- Toute evolution d'endpoint doit mettre a jour `docs/API.md`.
- Toute evolution de deploiement doit mettre a jour `docs/DEPLOYMENT.md`.
- Toute evolution de test ou outil doit mettre a jour `docs/TESTING.md`.
- Toute evolution i18n doit mettre a jour `docs/I18N.md`.
- Toute convention importante pour les assistants doit etre reportee dans `.github/copilot-instructions.md`.

## Fonctionnalites Non Documentees Car Non Existantes

Ces sujets ne doivent pas etre documentes comme actifs tant qu'ils ne sont pas implementes:

- authentification
- base de donnees
- comptes utilisateurs
- PWA/service worker
- notifications push
- tests E2E Playwright
- cache persistant
- Docker

## Dernieres Validations Connues

Commandes deja validees localement:

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
