import { makeAutoObservable } from 'mobx';

import { HomePageDataSource } from '../api/HomePageDataSource';

export class HomePageViewModel {
  private readonly dataSource = new HomePageDataSource();

  constructor() {
    makeAutoObservable(this);
  }

  get heroProducts() {
    return this.dataSource.getSnapshot().products.slice(0, 3);
  }

  get releases() {
    return this.dataSource.getSnapshot().releases;
  }

  get proofItems() {
    return [
      'Mock catalog rows mirror future Revisium tables.',
      'Nested specs and document lists stay visible in the UI contract.',
      'Release chips reserve space for branch/revision diff evidence.',
    ];
  }
}
