# Material Design - Meteo360

Meteo360 utilise Angular Material 21 avec un theme Material Design 3. L'objectif est une interface de dashboard claire, responsive et efficace pour consulter la meteo, pas une landing page marketing.

## Philosophie UI

- Prioriser la lisibilite des donnees.
- Garder les actions principales visibles.
- Utiliser les composants Material plutot que des controles custom.
- Limiter les effets decoratifs.
- Respecter les contraintes mobiles.

## Theme Global

Le theme est configure dans `frontend/src/styles.scss`:

```scss
@use "@angular/material" as mat;

html {
  @include mat.theme(
    (
      color: (
        primary: mat.$azure-palette,
        tertiary: mat.$orange-palette,
      ),
      typography: (
        plain-family: "Roboto",
        brand-family: "Roboto",
      ),
      density: (
        scale: 0,
      ),
    )
  );
}
```

Fonts et icones:

```scss
@import "@fontsource/roboto/300.css";
@import "@fontsource/roboto/400.css";
@import "@fontsource/roboto/500.css";
@import "@fontsource/roboto/700.css";
@import "material-icons/iconfont/material-icons.css";
```

## Tokens Projet

Variables globales actuelles:

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

Usage:

- `--meteo-ink`: texte principal
- `--meteo-muted`: texte secondaire
- `--meteo-surface`: fond global
- `--meteo-teal`: actions, etats actifs, badges
- `--meteo-sun`: icones et accents meteo
- `--meteo-sky`: fonds atmospheriques
- `--meteo-mint`: surfaces secondaires
- `--meteo-warm`: details de prevision

## Composants Utilises

- `MatButtonModule`: actions recherche et refresh
- `MatCardModule`: panneaux meteo et cartes jour
- `MatChipsModule`: contexte actuel, heure, fuseau, jour/nuit
- `MatFormFieldModule`: champ de recherche
- `MatIconModule`: pictogrammes meteo et actions
- `MatInputModule`: saisie ville
- `MatProgressBarModule`: probabilite de pluie horaire
- `MatProgressSpinnerModule`: etats de chargement
- `MatTooltipModule`: libelles d'actions iconiques

## Guidelines De Layout

### Dashboard

Le layout principal est `app-shell`:

- largeur maximum: `1180px`
- padding desktop: `24px`
- padding mobile: `16px`
- grille principale responsive

### Cartes

Les cartes Meteo360 utilisent un rayon modere:

```scss
border-radius: 8px;
```

Ce choix garde une interface operationnelle et sobre.

### Donnees Meteo

Les metriques sont groupees visuellement:

- ressenti
- humidite
- vent
- pluie
- couverture nuageuse
- direction du vent

Chaque bloc doit garder une hauteur stable pour eviter les sauts de layout.

Le panneau actuel utilise une variante jour/nuit et des chips Material pour donner du contexte sans surcharger l'ecran.

## Responsive

Breakpoints actuels:

```scss
@media (max-width: 1050px) { ... }
@media (max-width: 760px) { ... }
@media (max-width: 640px) { ... }
@media (max-width: 430px) { ... }
```

Regles:

- passer la grille principale en une colonne sous 1050px
- empiler la recherche sous 760px
- empiler la topbar et les cartes quotidiennes sous 640px
- passer les metriques et heures en une colonne sous 430px
- reduire les cartes et typographies sur mobile
- eviter le texte qui deborde dans les boutons
- conserver les boutons tactiles avec une hauteur confortable

## Accessibilite

- Utiliser les composants Material pour profiter de leur support ARIA.
- Ajouter `aria-label` ou tooltip pour les boutons icones.
- Garder le contraste suffisant entre texte et fond.
- Ne pas utiliser uniquement la couleur pour indiquer l'etat actif.
- Conserver les focus natifs des boutons et champs.

## Icones Meteo

Mapping actuel dans `App.weatherIcon()`:

| Codes WMO     | Icone Material |
| ------------- | -------------- |
| `0`           | `wb_sunny`     |
| `1`, `2`, `3` | `filter_drama` |
| pluie         | `grain`        |
| neige         | `ac_unit`      |
| orage         | `flash_on`     |
| fallback      | `cloud`        |

Si le mapping evolue, garder les libelles dans Transloco et la logique dans TypeScript, pas dans le template.

## A Eviter

- Ajouter une landing page avant le dashboard.
- Ajouter des images ou decorations qui ralentissent la consultation meteo.
- Introduire une palette trop monochrome.
- Mettre des textes explicatifs permanents sur l'usage de l'interface.
- Remplacer Material par des composants custom sans raison forte.
