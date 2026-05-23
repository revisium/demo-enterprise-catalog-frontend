import { makeAutoObservable } from 'mobx';

import { ProductDetailPageDataSource } from '../api/ProductDetailPageDataSource';

export class ProductDetailPageViewModel {
  private readonly dataSource = new ProductDetailPageDataSource();

  constructor(private readonly productId: string | undefined) {
    makeAutoObservable(this);
  }

  get product() {
    return this.dataSource.getProduct(this.productId);
  }

  get sourceEvidence() {
    return [
      `Future table: products / row ${this.product.id}`,
      'Nested object: specs',
      'Array fields: protocols, documents, metrics',
      'Future file links: datasheets, manuals, certificates',
    ];
  }
}
