import {Component, OnInit, ViewChild} from '@angular/core';
import {AppInfo} from '../../app.info';
import {TranslocoService} from '@ngneat/transloco';
import {DomSanitizer} from '@angular/platform-browser';
import {HtaccessGenerator} from '../../htaccess-generator';
import * as clipboard from 'clipboard-polyfill';
import {fadeInExpandOnEnterAnimation, fadeOutCollapseOnLeaveAnimation} from 'angular-animations';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
  animations: [
    fadeInExpandOnEnterAnimation(),
    fadeOutCollapseOnLeaveAnimation()
  ]
})
export class GeneratorComponent implements OnInit {
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

  @ViewChild('pop', {static: true}) clipboardTooltip: any;

  public get version(): string {
    return AppInfo.version;
  }

  constructor(private translocoService: TranslocoService, private domSanitizer: DomSanitizer) {
    this.generateHtaccessFile();
  }

  ngOnInit(): void {
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
