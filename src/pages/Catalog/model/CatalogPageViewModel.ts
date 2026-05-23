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

  get summaryMetrics() {
    return [
      { label: 'Products', value: String(this.products.length) },
      { label: 'Families', value: String(this.families.length) },
      {
        label: 'Documents',
        value: String(this.products.reduce((total, product) => total + product.documents.length, 0)),
      },
    ];
  }
}
