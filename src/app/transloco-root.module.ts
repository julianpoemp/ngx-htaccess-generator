import {HttpClient} from '@angular/common/http';
import {Translation, TRANSLOCO_CONFIG, TRANSLOCO_LOADER, translocoConfig, TranslocoLoader, TranslocoModule} from '@ngneat/transloco';
import {Injectable, NgModule} from '@angular/core';
import {environment} from '../environments/environment';

@Injectable({providedIn: 'root'})
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {
  }

  getTranslation(lang: string) {
    return this.http.get<Translation>(`assets/i18n/${lang}.json`);
  }
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['en', 'de', 'pt-br'],
        defaultLang: 'en',
        fallbackLang: 'en',
        missingHandler: {
          useFallbackTranslation: true
        },
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: environment.production
      })
    },
    {provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader}
  ]
})
export class TranslocoRootModule {
}
