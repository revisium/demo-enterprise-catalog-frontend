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
}
