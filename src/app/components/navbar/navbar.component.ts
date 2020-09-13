import {Component, Input, OnInit} from '@angular/core';
import {AppInfo} from '../../app.info';
import {TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public navbarCollapse = true;

  availableLanguages = [];

  @Input() darkMode = false;

  public get version(): string {
    return AppInfo.version;
  }

  public get selectedLanguage(): string {
    return this.translocoService.getActiveLang();
  }

  changeSelectedLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  constructor(private translocoService: TranslocoService) {
    this.availableLanguages = this.translocoService.getAvailableLangs();
    // @ts-ignore
    const userLang = navigator.language || navigator.userLanguage;
    this.translocoService.setDefaultLang('en');
    if (userLang && this.translocoService.getAvailableLangs().findIndex(a => a === userLang.substring(0, 2)) > -1) {
      this.translocoService.setActiveLang(userLang.substring(0, 2));
    }
  }

  ngOnInit(): void {
  }

}
