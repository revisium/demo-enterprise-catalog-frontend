import { makeAutoObservable } from 'mobx';

import type { CatalogProduct } from 'src/entities/catalog';
import { CatalogPageDataSource } from '../api/CatalogPageDataSource';

type CatalogProductRow = CatalogProduct & {
  readonly detailHref: string;
};

export class CatalogPageViewModel {
  private readonly dataSource = new CatalogPageDataSource();

  constructor() {
    makeAutoObservable(this);
  }

  get products(): readonly CatalogProductRow[] {
    return this.dataSource.getProducts().map((product) => ({
      ...product,
      detailHref: `/catalog/${product.id}`,
    }));
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
