export const enTranslations = {
    app: {
        title: 'Meteo360',
        eyebrow: 'Local observation',
        subtitle: 'Real-time weather forecast',
        refresh: 'Refresh',
        live_dashboard: 'Live data',
        syncing: 'Syncing'
    },
    search: {
        aria_label: 'Weather search',
        open_tooltip: 'Search a location',
        open_button: 'Search a location',
        dialog_title: 'Choose a location',
        subtitle: 'City, region or current position',
        placeholder: 'Enter a city',
        typing_hint: 'Type at least 2 letters to see suggestions.',
        no_suggestions: 'No matching location.',
        close: 'Close search',
        unavailable: 'Search is currently unavailable.',
        no_results: 'No location found.'
    },
    location: {
        detecting: 'Detecting your location',
        detected: 'Location detected',
        current_name: 'Your location',
        button: 'My location',
        unavailable: 'Location unavailable.',
        denied: 'Location not allowed.',
        timeout: 'Location timed out.',
        unavailable_fallback: 'Location unavailable, Paris is displayed.',
        denied_fallback: 'Location not allowed, Paris is displayed.',
        timeout_fallback: 'Location timed out, Paris is displayed.'
    },
    weather: {
        loading_forecast: 'Loading forecast',
        now: 'Now',
        preview_at: 'Preview {{time}}',
        back_to_live: 'Back to live',
        day: 'Day',
        night: 'Night',
        choose_city_title: 'Choose a city',
        choose_city_message: 'Search a destination to display the weather and forecast.',
        feels_like: 'Feels like',
        humidity: 'Humidity',
        wind: 'Wind',
        wind_direction: 'Direction',
        rain: 'Rain',
        cloud_cover: 'Clouds',
        updated_at: 'Updated',
        forecast_unavailable: 'Forecast unavailable for this location.',
        invalid: 'Unknown weather',
        clear: 'Clear sky',
        variable: 'Variable',
        fog: 'Fog',
        rainy: 'Rain',
        snowy: 'Snow',
        storm: 'Storm',
        cloudy: 'Cloudy',
        cardinal: {
            N: 'N',
            NE: 'NE',
            E: 'E',
            SE: 'SE',
            S: 'S',
            SW: 'SW',
            W: 'W',
            NW: 'NW'
        }
    },
    current: {
        now: 'Now',
        preview: 'Preview',
        back_to_now: 'Back to live',
        place_eyebrow: 'Selected location',
        no_place: 'No location',
        empty: 'Select a location to display the weather.',
        feels_like: 'Feels like',
        daily_range: 'Min · Max',
        metrics_aria: 'Current weather indicators',
        uv_label: 'UV',
        uv_meter_aria: 'UV gauge {{value}} out of {{max}}',
        wind_gusts: 'Gusts',
        precipitation_24h: 'Rain today',
        rain_chart_aria: 'Hour-by-hour rainfall across the day',
        rain_intensity: {
          dry: 'Dry',
          showers: 'A few showers',
          steady: 'Steady rain'
        },
        sun_progress_aria: 'Sun position',
        day_length: 'Daylight',
        night: 'Night',
        next_sunrise: 'Sunrise',
        tomorrow_sunrise: "Tomorrow's sunrise",
        temp_unavailable: 'Temperature unavailable'
    },
    timeline: {
        title: 'Timeline',
        curve_label: 'Temperature',
        empty: 'No forecast',
        now: 'Now',
        morning: 'Morning',
        afternoon: 'Afternoon',
        today: 'Today',
        tomorrow: 'Tomorrow',
        scroll_prev: 'Scroll timeline back',
        scroll_next: 'Scroll timeline forward',
        day_group_aria: '{{label}} time slots'
    },
    nav: {
        home: 'Weather',
        legal: 'Legal notice',
        open_menu: 'Open navigation menu',
        close_menu: 'Close navigation menu',
        lang_fr: 'French',
        lang_en: 'English',
        theme_light: 'Light',
        theme_dark: 'Dark',
        lang_select: 'Select language',
        theme_select: 'Select theme'
    },
    legal: {
        title: 'Legal notice',
        subtitle: 'Legal information and about the project',
        about_title: 'About the project',
        about_description: 'Meteo360 is a personal weather dashboard built with Angular 21 on the frontend and a Jelix PHP backend. Weather data is provided by Open-Meteo, a free open-source service with no sign-up required.',
        about_purpose: 'This project illustrates modern Angular best practices: standalone architecture, signals, OnPush strategy, and integration of a third-party weather API through a PHP backend.',
        tech_label: 'Technologies used',
        highlights_title: 'Highlights',
        highlight_signals: 'Signals & OnPush',
        highlight_signals_desc: 'Optimal performance through Angular signals and the OnPush change detection strategy.',
        highlight_standalone: 'Standalone components',
        highlight_standalone_desc: 'Modern Angular 21 architecture, without NgModule, using inject() and control flow.',
        highlight_open_meteo: 'Open-Meteo',
        highlight_open_meteo_desc: 'Open-source, free weather data with no API key. Called from the backend only.',
        highlight_tests: 'Unit tests',
        highlight_tests_desc: 'Coverage with Vitest, strict ESLint linting.',
        author_title: 'Author & Developer',
        author_name: 'Christophe Saint-Julien',
        author_role: 'Expert Angular Front-End Developer',
        author_github_label: 'GitHub profile',
        author_github_desc: "Discover the author's open-source projects, contributions and technical experiments.",
        author_repo_label: 'Project source code',
        author_repo_desc: 'Browse the full source code of Meteo360: architecture, tests and technical documentation.',
        disclaimer_title: 'Disclaimer',
        disclaimer_not_production: 'This application is a personal demonstration project. It is not intended for production use or to provide a long-term weather service.',
        disclaimer_may_change: 'The application may be modified, suspended or removed at any time without notice.',
        disclaimer_recommendation: 'For reliable weather forecasts, it is recommended to use established services such as Météo-France, Weather.com or other well-known applications.',
        data_title: 'Weather data',
        data_description: 'Weather data comes from Open-Meteo (open-meteo.com), a free open-source service. It is displayed for informational purposes only and does not constitute an official weather advisory.',
        data_attribution: 'Data provided by Open-Meteo — free open-source weather API.'
    },
    not_found: {
        title: '404',
        subtitle: 'Page not found',
        message: 'The page you are looking for does not exist or has been moved.',
        back: 'Back to weather'
    },
    seo: {
        default: {
            description: 'Real-time weather forecast. Check current conditions and hourly forecasts for any city.'
        },
        dashboard: {
            description: 'Check current weather, hourly forecasts and key indicators for any city with Meteo360.'
        },
        legal: {
            description: 'Legal notice, information about the Meteo360 project and credits for the technologies used.'
        },
        not_found: {
            description: 'The requested page was not found. Return to the Meteo360 weather dashboard.'
        }
    }
};
