import { provideHttpClient, withFetch } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';
import {
  ApplicationConfig,
  Injectable,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideTransloco, TranslocoLoader, Translation } from '@jsverse/transloco';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';
import { Observable, of } from 'rxjs';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { frTranslations } from './i18n/fr';
import { enTranslations } from './i18n/en';
import { LANG_STORAGE_KEY } from './services/storage.service';

registerLocaleData(localeFr);
registerLocaleData(localeEn, 'en-US');

@Injectable({ providedIn: 'root' })
export class TranslocoInlineLoader implements TranslocoLoader {
  getTranslation(lang: string): Observable<Translation> {
    return of(lang === 'en' ? enTranslations : frTranslations);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideTransloco({
      config: {
        availableLangs: ['fr', 'en'],
        defaultLang: 'fr',
        reRenderOnLangChange: true,
        prodMode: environment.production
      },
      loader: TranslocoInlineLoader
    }),
    provideTranslocoMessageformat(),
    { provide: LOCALE_ID, useFactory: (): string => {
      try {
        const raw = localStorage.getItem(LANG_STORAGE_KEY);
        return raw && JSON.parse(raw) === 'en' ? 'en-US' : 'fr-FR';
      } catch {
        return 'fr-FR';
      }
    }}
  ]
};
