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

  get fastestSetupHours() {
    const setupHours = this.product.availabilityByRegion.map((region) => region.setupHours);

    return setupHours.length > 0 ? Math.min(...setupHours) : 0;
  }

  get summaryMetrics() {
    return [
      { label: 'Monthly', value: `$${this.product.pricing.monthlyUsd}` },
      { label: 'Total stock', value: String(this.totalStock) },
      { label: 'Fastest setup', value: `${this.fastestSetupHours}h` },
    ];
  }

  get totalStock() {
    return this.product.availabilityByRegion.reduce((total, region) => total + region.stock, 0);
  }
}
