import {Component, ViewChild} from '@angular/core';
import {TranslocoService} from '@ngneat/transloco';
import {fadeInExpandOnEnterAnimation, fadeOutCollapseOnLeaveAnimation} from 'angular-animations';
import {HtaccessGenerator} from './htaccess-generator';
import {DomSanitizer} from '@angular/platform-browser';
import {AppInfo} from './app.info';
import * as clipboard from 'clipboard-polyfill';

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

  @ViewChild('pop', {static: true}) clipboardTooltip: any;

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

    this.generateHtaccessFile();
  }

  changeSelectedLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  generateHtaccessFile() {
    const generator = new HtaccessGenerator(this.questions, AppInfo.version);

    this.htaccessFile.content = generator.generate();
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
      this.generateHtaccessFile();
    }
  }

  removeExclusion(i: number) {
    this.questions.exclusions.list.splice(i, 1);
    this.generateHtaccessFile();
  }

  copyToClipBoard() {
    clipboard.writeText(this.htaccessFile.content);
    this.clipboardTooltip.show();
    setTimeout(() => {
      this.clipboardTooltip.hide();
    }, 1000);
  }
}
