import {Component} from '@angular/core';
import {TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  questions = {
    baseHref: {
      checked: false
    },
    httpsRedirection: {
      checked: false
    },
    exclusions: {
      checked: false,
      list: []
    },
    browserCachingDisabled: {
      checked: false
    }
  };

  title = 'ngx-htaccess-generator';

  availableLanguages = [];

  public get selectedLanguage(): string {
    return this.translocoService.getActiveLang();
  }

  constructor(private translocoService: TranslocoService) {
    this.availableLanguages = this.translocoService.getAvailableLangs();
  }

  changeSelectedLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  generateHtaccessFile() {
  }
}
