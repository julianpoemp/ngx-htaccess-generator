import {Injectable, OnDestroy} from '@angular/core';
import {interval} from 'rxjs';
import {SubscriptionManager} from './subscription-manager';

@Injectable({
  providedIn: 'root'
})
export class AppService implements OnDestroy {
  private subscrManager = new SubscriptionManager();
  public lastDarkModeActive = false;

  constructor() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.lastDarkModeActive = true;
    }

    this.subscrManager.add(interval(1000).subscribe(() => {
      const darkModeActiveNow = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (!this.lastDarkModeActive && darkModeActiveNow) {
        console.log(`dark mode detected`);
        this.lastDarkModeActive = true;
      } else if (this.lastDarkModeActive && !darkModeActiveNow) {
        this.lastDarkModeActive = false;
      }
    }));
  }

  ngOnDestroy() {
    this.subscrManager.destroy();
  }
}
