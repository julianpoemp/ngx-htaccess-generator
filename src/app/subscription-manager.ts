import {Subscription} from 'rxjs';

export class SubscriptionManager {
  private subscriptions: {
    id: number,
    tag: string,
    subscription: Subscription
  }[];

  private counter: number;

  constructor() {
    this.subscriptions = [];
    this.counter = 0;
  }

  /**
   * add subscription to the manager. Returns the id of the subscriptions
   * @param subscription subscription that shall be added
   * @param tag optional tag
   * @returns number
   */
  public add(subscription: Subscription, tag?: string): number {
    this.subscriptions.push(
      {
        id: ++this.counter,
        tag,
        subscription
      }
    );
    return this.counter;
  }

  /**
   * unsubscribes all subscriptions
   */
  public destroy() {
    if (!(this.subscriptions === null || this.subscriptions === undefined)) {
      for (const elem of this.subscriptions) {
        elem.subscription.unsubscribe();
      }
      this.subscriptions = [];
    }
  }

  /**
   * unsubscribes specific Subscription with specific id.
   * @param id id that is looked for
   */
  public removeById(id: number): boolean {
    for (let i = 0; i < this.subscriptions.length; i++) {
      const element = this.subscriptions[i];

      if (element.id === id) {
        element.subscription.unsubscribe();
        this.subscriptions.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  /***
   * unsubscribes all subscriptions with a specific tag
   * @param tag name that is tagged to the subscription
   */
  public removeByTag(tag: string): boolean {
    let removed = false;
    for (let i = 0; i < this.subscriptions.length; i++) {
      const element = this.subscriptions[i];

      if (element.tag === tag) {
        element.subscription.unsubscribe();
        this.subscriptions.splice(i, 1);
        removed = true;
      }
    }
    return removed;
  }
}
