import { TranslocoTestingModule, TranslocoTestingOptions } from '@jsverse/transloco';

import { enTranslations } from '../i18n/en';
import { frTranslations } from '../i18n/fr';

export function getTranslocoTestingModule(options: TranslocoTestingOptions = {}) {
    return TranslocoTestingModule.forRoot({
        langs: { fr: frTranslations, en: enTranslations },
        translocoConfig: {
            availableLangs: ['fr', 'en'],
            defaultLang: 'fr'
        },
        preloadLangs: true,
        ...options
    });
}
