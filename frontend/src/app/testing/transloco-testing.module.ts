import { TranslocoTestingModule, TranslocoTestingOptions } from '@jsverse/transloco';

import { frTranslations } from '../i18n/fr';

export function getTranslocoTestingModule(options: TranslocoTestingOptions = {}) {
    return TranslocoTestingModule.forRoot({
        langs: { fr: frTranslations },
        translocoConfig: {
            availableLangs: ['fr'],
            defaultLang: 'fr'
        },
        preloadLangs: true,
        ...options
    });
}
