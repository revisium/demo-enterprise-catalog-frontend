import { makeAutoObservable } from 'mobx';

import { catalogSnapshot, type CatalogProduct } from 'src/entities/catalog';

type CompareMetricId = 'cpu' | 'memory' | 'storage' | 'network' | 'price' | 'setup' | 'stock';

interface CompareMetric {
  readonly id: CompareMetricId;
  readonly label: string;
  readonly values: readonly string[];
}

export class ComparePageViewModel {
  readonly products = catalogSnapshot.products.slice(0, 4);

  constructor() {
    makeAutoObservable(this);
  }

  get metrics(): readonly CompareMetric[] {
    return [
      {
        id: 'price',
        label: 'Monthly price',
        values: this.products.map((product) => `$${product.pricing.monthlyUsd}/mo`),
      },
      {
        id: 'cpu',
        label: 'CPU',
        values: this.products.map((product) => `${product.hardware.cpuCores} cores`),
      },
      {
        id: 'memory',
        label: 'Memory',
        values: this.products.map((product) => `${product.hardware.ramGb} GB`),
      },
      {
        id: 'storage',
        label: 'Storage',
        values: this.products.map((product) => `${product.hardware.storageTb} TB`),
      },
      {
        id: 'network',
        label: 'Network',
        values: this.products.map((product) => `${product.hardware.networkGbps} Gbps`),
      },
      {
        id: 'setup',
        label: 'Fastest setup',
        values: this.products.map((product) => `${this.getFastestSetup(product)}h`),
      },
      {
        id: 'stock',
        label: 'Total stock',
        values: this.products.map((product) => String(this.getTotalStock(product))),
      },
    ];
  }

  get highlights() {
    return [
      {
        label: 'Plans compared',
        value: String(this.products.length),
      },
      {
        label: 'Lowest monthly',
        value: `$${Math.min(...this.products.map((product) => product.pricing.monthlyUsd))}`,
      },
      {
        label: 'Regions covered',
        value: String(
          new Set(
            this.products.flatMap((product) =>
              product.availabilityByRegion.map((region) => region.regionId),
            ),
          ).size,
        ),
      },
    ];
  }

  get recommendation() {
    const [firstProduct, ...remainingProducts] = this.products;

    if (!firstProduct) {
      return undefined;
    }

    return remainingProducts.reduce(
      (best, product) => (this.getTotalStock(product) > this.getTotalStock(best) ? product : best),
      firstProduct,
    );
  }

  private getFastestSetup(product: CatalogProduct) {
    return Math.min(...product.availabilityByRegion.map((region) => region.setupHours));
  }

  private getTotalStock(product: CatalogProduct) {
    return product.availabilityByRegion.reduce((total, region) => total + region.stock, 0);
  }
}
