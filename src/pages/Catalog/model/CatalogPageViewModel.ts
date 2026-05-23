import { makeAutoObservable } from 'mobx';

import { CatalogPageDataSource } from '../api/CatalogPageDataSource';

export class CatalogPageViewModel {
  private readonly dataSource = new CatalogPageDataSource();

  constructor() {
    makeAutoObservable(this);
  }

  get products() {
    return this.dataSource.getProducts();
  }

  get families() {
    return [...new Set(this.products.map((product) => product.family))];
  }
}
