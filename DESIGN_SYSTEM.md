# Design System - Meteo360

Meteo360 utilise un design system simple, centre sur la consultation rapide de donnees meteo. L'objectif est une interface calme, responsive et operationnelle.

## Fondations

### Stack UI

- Angular Material 21
- Material Design 3 via `@angular/material`
- Roboto local via `@fontsource/roboto`
- Material Icons via `material-icons`
- SCSS global dans `frontend/src/styles.scss`
- SCSS composant dans `frontend/src/app/app.scss`

### Palette Projet

Tokens actuels:

```scss
:root {
  --meteo-ink: #17383b;
  --meteo-muted: #607274;
  --meteo-surface: #f7fbfa;
  --meteo-teal: #1f7a76;
  --meteo-sun: #d77a39;
  --meteo-sky: #def4ff;
  --meteo-mint: #e8f7f0;
  --meteo-warm: #fff1dd;
}
```

Roles:

| Token             | Usage                               |
| ----------------- | ----------------------------------- |
| `--meteo-ink`     | Texte principal                     |
| `--meteo-muted`   | Texte secondaire et metadonnees     |
| `--meteo-surface` | Fond global                         |
| `--meteo-teal`    | Accents principaux et etats actifs  |
| `--meteo-sun`     | Icones et accents meteo chauds      |
| `--meteo-sky`     | Fonds atmospheriques clairs         |
| `--meteo-mint`    | Surfaces secondaires douces         |
| `--meteo-warm`    | Surfaces detail et prevision chaude |

Material theme:

- primary: `mat.$azure-palette`
- tertiary: `mat.$orange-palette`

## Typographie

La police par defaut est Roboto.

Regles:

- titres courts et lisibles
- pas de letter spacing negatif
- pas de texte hero dans les panneaux compacts
- garder les libelles de cartes courts
- utiliser les pipes Angular pour dates et nombres

## Formes

Meteo360 utilise des rayons sobres:

```scss
border-radius: 8px;
```

Applique a:

- cartes principales
- cartes jour
- boutons de lieu
- blocs de metriques
- bouton de recherche

## Espacement

Grands conteneurs:

```scss
width: min(1180px, 100%);
margin: 0 auto;
```

Padding principal:

- desktop: `24px`
- mobile: `16px`

Gaps usuels:

- grille principale: `16px`
- metriques: `12px`
- liste de lieux: `8px`

## Composants

### Topbar

Contient:

- marque visuelle iconique Material
- eyebrow `Meteo360`
- titre dashboard
- sous-titre court
- badge de statut meteo live
- bouton iconique refresh avec tooltip traduit

### Search Panel

Contient:

- `mat-form-field` en `outline`
- input search
- bouton Material avec icone `travel_explore`
- message d'erreur traduit

### Current Panel

Affiche:

- lieu selectionne
- temperature actuelle
- libelle condition
- icone WMO mappee dans un cadre visuel
- chips Material pour heure, fuseau et jour/nuit
- metriques ressenti/humidite/vent/pluie/couverture/direction

Le panneau actuel peut adopter une variante nuit selon `current.is_day`.

### Places Panel

Liste les lieux retournes par Open-Meteo. L'item actif doit etre visible par couleur et bordure.

### Hourly Panel

Affiche les prochaines heures sous forme de grille compacte avec icone meteo, probabilite de pluie et `mat-progress-bar`.

### Daily Grid

Affiche les previsions quotidiennes sur 7 jours.

## Responsive

Breakpoints actuels:

```scss
@media (max-width: 1050px) @media (max-width: 760px) @media (max-width: 640px) @media (max-width: 430px);
```

Sous 1050px:

- layout principal en une colonne

Sous 760px:

- recherche en une colonne
- metriques en deux colonnes
- titre et marque reduits

Sous 640px:

- padding reduit
- formulaire en une colonne
- topbar empilee
- cartes quotidiennes en une colonne
- temperature reduite

Sous 430px:

- panneau actuel empile totalement
- metriques et heures en une colonne

## Accessibilite

- Les boutons iconiques doivent avoir tooltip ou aria-label.
- Les regions importantes doivent avoir `aria-label` traduit.
- Garder les contrastes suffisants.
- Ne pas supprimer les focus natifs Material.
- Ne pas utiliser uniquement la couleur pour transmettre une information.

## A Ne Pas Faire

- Transformer la premiere vue en landing page marketing.
- Ajouter des orbes, backgrounds purement decoratifs ou compositions hero.
- Introduire un theme monochrome lourd.
- Faire des cartes imbriquees sans necessite.
- Remplacer les composants Material par des implementations custom sans besoin reel.
