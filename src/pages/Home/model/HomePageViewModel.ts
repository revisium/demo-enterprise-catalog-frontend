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
      'Future project: enterprise-catalog-data.',
      'Candidate tables: products, documents, catalogReleases.',
      'Nested specs, protocol arrays, document arrays, and release states are already represented.',
    ];
  }
}
