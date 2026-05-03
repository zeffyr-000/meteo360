import { provideHttpClient, withFetch } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
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

registerLocaleData(localeFr);

@Injectable({ providedIn: 'root' })
export class TranslocoInlineLoader implements TranslocoLoader {
  getTranslation(): Observable<Translation> {
    return of(frTranslations);
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
        availableLangs: ['fr'],
        defaultLang: 'fr',
        reRenderOnLangChange: true,
        prodMode: environment.production
      },
      loader: TranslocoInlineLoader
    }),
    provideTranslocoMessageformat(),
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ]
};
