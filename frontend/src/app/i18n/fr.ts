export const frTranslations = {
    app: {
        title: 'Meteo360',
        eyebrow: 'Observation locale',
        subtitle: 'Prévisions météo en temps réel',
        refresh: 'Actualiser',
        live_dashboard: 'Données actives',
        syncing: 'Synchronisation'
    },
    search: {
        aria_label: 'Recherche météo',
        open_tooltip: 'Rechercher un lieu',
        open_button: 'Rechercher un lieu',
        dialog_title: 'Choisir un lieu',
        subtitle: 'Ville, région ou position actuelle',
        placeholder: 'Saisir une ville',
        typing_hint: 'Tape au moins 2 lettres pour voir des suggestions.',
        no_suggestions: 'Aucun lieu ne correspond.',
        close: 'Fermer la recherche',
        unavailable: 'La recherche est indisponible pour le moment.',
        no_results: 'Aucun lieu trouvé.'
    },
    location: {
        detecting: 'Détection de votre position',
        detected: 'Position détectée',
        current_name: 'Votre position',
        button: 'Ma position',
        unavailable: 'Position indisponible.',
        denied: 'Position non autorisée.',
        timeout: 'Localisation trop lente.',
        unavailable_fallback: 'Position indisponible, Paris est affichée.',
        denied_fallback: 'Position non autorisée, Paris est affichée.',
        timeout_fallback: 'Localisation trop lente, Paris est affichée.'
    },
    weather: {
        loading_forecast: 'Chargement des prévisions',
        now: 'Maintenant',
        preview_at: 'Aperçu {{time}}',
        back_to_live: 'Retour en direct',
        day: 'Jour',
        night: 'Nuit',
        choose_city_title: 'Choisis une ville',
        choose_city_message: 'Recherche une destination pour afficher la météo et les prévisions.',
        feels_like: 'Ressenti',
        humidity: 'Humidité',
        wind: 'Vent',
        wind_direction: 'Direction',
        rain: 'Pluie',
        cloud_cover: 'Nuages',
        updated_at: 'Actualisé',
        forecast_unavailable: 'Les prévisions sont indisponibles pour ce lieu.',
        invalid: 'Météo inconnue',
        clear: 'Ciel dégagé',
        variable: 'Variable',
        fog: 'Brouillard',
        rainy: 'Pluie',
        snowy: 'Neige',
        storm: 'Orage',
        cloudy: 'Nuageux',
        cardinal: {
            N: 'N',
            NE: 'NE',
            E: 'E',
            SE: 'SE',
            S: 'S',
            SW: 'SO',
            W: 'O',
            NW: 'NO'
        }
    },
    current: {
        now: 'Maintenant',
        preview: 'Aperçu',
        back_to_now: 'Revenir au direct',
        place_eyebrow: 'Lieu sélectionné',
        no_place: 'Aucun lieu',
        empty: 'Sélectionne un lieu pour afficher la météo.',
        feels_like: 'Ressenti',
        daily_range: 'Min · Max',
        metrics_aria: 'Indicateurs météo du moment',
        uv_label: 'UV',
        uv_meter_aria: 'Jauge UV {{value}} sur {{max}}',
        wind_gusts: 'Rafales',
        precipitation_24h: 'Pluie 24 h',
        sun_progress_aria: 'Course du soleil',
        day_length: 'Durée du jour',
        night: 'Nuit',
        next_sunrise: 'Lever du soleil',
        tomorrow_sunrise: 'Lever demain',
        temp_unavailable: 'Température indisponible'
    },
    timeline: {
        title: 'Chronologie',
        curve_label: 'Température',
        empty: 'Aucune prévision',
        now: 'Maintenant',
        morning: 'Matin',
        afternoon: 'Après-midi',
        today: 'Aujourd’hui',
        tomorrow: 'Demain',
        scroll_prev: 'Reculer dans la chronologie',
        scroll_next: 'Avancer dans la chronologie',
        day_group_aria: 'Créneaux du {{label}}'
    },
    nav: {
        home: 'Météo',
        legal: 'Mentions légales',
        open_menu: 'Ouvrir le menu de navigation',
        close_menu: 'Fermer le menu de navigation',
        lang_fr: 'Français',
        lang_en: 'Anglais',
        theme_light: 'Clair',
        theme_dark: 'Sombre',
        lang_select: 'Choisir la langue',
        theme_select: 'Choisir le thème'
    },
    legal: {
        title: 'Mentions légales',
        subtitle: 'Informations légales et à propos du projet',
        about_title: 'À propos du projet',
        about_description: 'Meteo360 est un tableau de bord météo personnel construit avec Angular 21 côté frontend et un backend Jelix PHP. Les données météorologiques sont fournies par Open-Meteo, un service open-source gratuit et sans inscription.',
        about_purpose: 'Ce projet illustre les bonnes pratiques Angular modernes : architecture standalone, signals, stratégie OnPush, et intégration d\'une API météo tierce via un backend PHP.',
        tech_label: 'Technologies utilisées',
        highlights_title: 'Points forts',
        highlight_signals: 'Signals & OnPush',
        highlight_signals_desc: 'Performances optimales grâce aux signals Angular et à la stratégie de détection OnPush.',
        highlight_standalone: 'Composants standalone',
        highlight_standalone_desc: 'Architecture Angular 21 moderne, sans NgModule, avec inject() et control flow.',
        highlight_open_meteo: 'Open-Meteo',
        highlight_open_meteo_desc: 'Données météo open-source, gratuites, sans clé API. Appelées côté backend uniquement.',
        highlight_tests: 'Tests unitaires',
        highlight_tests_desc: 'Couverture avec Vitest, linting ESLint strict.',
        author_title: 'Auteur & Développeur',
        author_name: 'Christophe Saint-Julien',
        author_role: 'Développeur Front-End Expert Angular',
        author_github_label: 'Profil GitHub',
        author_github_desc: 'Découvrir les projets open-source, contributions et expérimentations techniques de l\'auteur.',
        author_repo_label: 'Code source du projet',
        author_repo_desc: 'Consulter le code source complet de Meteo360 : architecture, tests et documentation technique.',
        disclaimer_title: 'Avertissement',
        disclaimer_not_production: 'Cette application est un projet personnel de démonstration. Elle n\'a pas vocation à être utilisée en production ni à fournir un service météo pérenne.',
        disclaimer_may_change: 'L\'application peut être modifiée, suspendue ou supprimée à tout moment, sans préavis.',
        disclaimer_recommendation: 'Pour des prévisions météo fiables, il est recommandé d\'utiliser des services reconnus tels que Météo-France, Weather.com ou d\'autres applications établies.',
        data_title: 'Données météo',
        data_description: 'Les données météorologiques proviennent de Open-Meteo (open-meteo.com), un service open-source et gratuit. Elles sont affichées à titre indicatif uniquement et ne constituent pas une information météorologique officielle.',
        data_attribution: 'Données fournies par Open-Meteo — API météo open-source gratuite.'
    },
    not_found: {
        title: '404',
        subtitle: 'Page introuvable',
        message: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
        back: 'Retour à la météo'
    },
    seo: {
        default: {
            description: 'Prévisions météo en temps réel. Consultez les conditions actuelles et les prévisions horaires pour n\'importe quelle ville.'
        },
        dashboard: {
            description: 'Consultez la météo actuelle, les prévisions horaires et les indicateurs clés pour n\'importe quelle ville avec Meteo360.'
        },
        legal: {
            description: 'Mentions légales, informations sur le projet Meteo360 et crédits des technologies utilisées.'
        },
        not_found: {
            description: 'La page demandée est introuvable. Retournez au tableau de bord météo Meteo360.'
        }
    }
};
