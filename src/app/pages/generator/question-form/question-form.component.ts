import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {HtaccessGenerator} from '../../../htaccess-generator';
import {AppInfo} from '../../../app.info';
import {TranslocoService} from '@ngneat/transloco';
import {DomSanitizer} from '@angular/platform-browser';
import {fadeInExpandOnEnterAnimation, fadeOutCollapseOnLeaveAnimation} from 'angular-animations';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css'],
  animations: [
    fadeInExpandOnEnterAnimation(),
    fadeOutCollapseOnLeaveAnimation()
  ]
})
export class QuestionFormComponent implements OnInit {
  public questions = {
    baseHref: {
      checked: false,
      showDescription: false
    },
    httpsRedirection: {
      checked: false,
      showDescription: false
    },
    exclusions: {
      checked: false,
      addEnabled: false,
      showDescription: false,
      list: []
    },
    browserCachingDisabled: {
      checked: false,
      showDescription: false
    },
    allowOrigins: {
      checked: false,
      showDescription: false,
      list: ['*'],
      addEnabled: false
    }
  };

  @Input() htaccessFile = {
    blobURL: null,
    content: ''
  };

  constructor(private translocoService: TranslocoService, private domSanitizer: DomSanitizer, public elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.generateHtaccessFile();
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

  addAllowOriginsDomwain(input: HTMLInputElement) {
    if (input.value.trim() !== '') {
      this.questions.allowOrigins.list = this.questions.allowOrigins.list.filter(a => a !== '*');
      this.questions.allowOrigins.list.push(input.value.trim());

      input.value = '';
      input.focus();
      this.generateHtaccessFile();
    }
  }

  removeDomainFromAllowOrigins(i: number) {
    this.questions.allowOrigins.list.splice(i, 1);
    if(this.questions.allowOrigins.list.length === 0) {
      this.questions.allowOrigins.list.push('*')
    }
    this.generateHtaccessFile();
  }

}
