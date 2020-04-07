import {Component} from '@angular/core';
import {TranslocoService} from '@ngneat/transloco';
import {fadeInExpandOnEnterAnimation, fadeOutCollapseOnLeaveAnimation} from 'angular-animations';
import {HtaccessGenerator} from './htaccess-generator';
import {DomSanitizer} from '@angular/platform-browser';
import {AppInfo} from './app.info';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    fadeInExpandOnEnterAnimation(),
    fadeOutCollapseOnLeaveAnimation()
  ]
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
      addEnabled: false,
      list: []
    },
    browserCachingDisabled: {
      checked: false
    }
  };

  htaccessFile = {
    blobURL: null,
    content: ''
  };

  title = 'ngx-htaccess-generator';

  availableLanguages = [];

  public get selectedLanguage(): string {
    return this.translocoService.getActiveLang();
  }

  constructor(private translocoService: TranslocoService, private domSanitizer: DomSanitizer) {
    this.availableLanguages = this.translocoService.getAvailableLangs();
    // @ts-ignore
    const userLang = navigator.language || navigator.userLanguage;
    this.translocoService.setDefaultLang('en');
    if (userLang && this.translocoService.getAvailableLangs().findIndex(a => a === userLang.substring(0, 2)) > -1) {
      this.translocoService.setActiveLang(userLang.substring(0, 2));
    }
  }

  changeSelectedLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  generateHtaccessFile() {
    this.htaccessFile.content = '';
    this.htaccessFile.blobURL = null;

    const generator = new HtaccessGenerator(this.questions, AppInfo.version);
    const result = generator.generate();

    this.htaccessFile.content = result;
    this.htaccessFile.blobURL = this.domSanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(new File([this.htaccessFile.content], '.htaccess', {type: 'text/plain'}))
    );
  }

  addExclusion(input: HTMLInputElement) {
    if (input.value.trim() !== '') {
      let value = input.value.replace(/\/+/g, '/');
      if (value[0] === '/') {
        value = `${value.substr(1)}`;
      }
      if (value[value.length - 1] !== '/') {
        value = `${value}/`;
      }
      this.questions.exclusions.list.push(value);
      input.value = '';
      input.focus();
      this.htaccessFile.blobURL = null;
    }
  }

  removeExclusion(i: number) {
    this.questions.exclusions.list.splice(i, 1);
    this.htaccessFile.blobURL = null;
  }
}
