import {Component, OnDestroy, OnInit} from '@angular/core';
import {SubscriptionManager} from './subscription-manager';
import {interval} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private subscrManager = new SubscriptionManager();
  public lastDarkModeActive = false;

  constructor() {
  }

  ngOnInit() {
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
