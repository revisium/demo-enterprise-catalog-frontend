import { makeAutoObservable } from 'mobx';

import { catalogSnapshot, type CatalogProduct } from 'src/entities/catalog';

type CompareMetricId = 'cpu' | 'memory' | 'storage' | 'network' | 'price' | 'setup' | 'stock';

interface CompareMetric {
  readonly id: CompareMetricId;
  readonly label: string;
  readonly values: readonly string[];
}

interface CompareOption {
  readonly id: string;
  readonly label: string;
}

export class ComparePageViewModel {
  readonly products = catalogSnapshot.products;
  selectedProductIds: readonly string[] = catalogSnapshot.products
    .slice(0, 4)
    .map((product) => product.id);
  selectedRegionId = 'all';
  stockOnly = true;

  constructor() {
    makeAutoObservable(this);
  }

  get comparedProducts(): readonly CatalogProduct[] {
    return this.products
      .filter((product) => this.selectedProductIdSet.has(product.id))
      .filter((product) => this.matchesRegion(product));
  }

  get metrics(): readonly CompareMetric[] {
    return [
      {
        id: 'price',
        label: 'Monthly price',
        values: this.comparedProducts.map((product) => `$${product.pricing.monthlyUsd}/mo`),
      },
      {
        id: 'cpu',
        label: 'CPU',
        values: this.comparedProducts.map((product) => `${product.hardware.cpuCores} cores`),
      },
      {
        id: 'memory',
        label: 'Memory',
        values: this.comparedProducts.map((product) => `${product.hardware.ramGb} GB`),
      },
      {
        id: 'storage',
        label: 'Storage',
        values: this.comparedProducts.map((product) => `${product.hardware.storageTb} TB`),
      },
      {
        id: 'network',
        label: 'Network',
        values: this.comparedProducts.map((product) => `${product.hardware.networkGbps} Gbps`),
      },
      {
        id: 'setup',
        label: 'Fastest setup',
        values: this.comparedProducts.map((product) => `${this.getFastestSetup(product)}h`),
      },
      {
        id: 'stock',
        label: 'Total stock',
        values: this.comparedProducts.map((product) => String(this.getTotalStock(product))),
      },
    ];
  }

  get highlights() {
    const monthlyPrices = this.comparedProducts.map((product) => product.pricing.monthlyUsd);
    const lowestMonthlyPrice = monthlyPrices.length > 0 ? Math.min(...monthlyPrices) : 0;

    return [
      {
        label: 'Plans compared',
        value: String(this.comparedProducts.length),
      },
      {
        label: 'Lowest monthly',
        value: `$${lowestMonthlyPrice}`,
      },
      {
        label: 'Regions covered',
        value: String(
          new Set(
            this.comparedProducts.flatMap((product) =>
              this.getMatchingRegions(product).map((region) => region.regionId),
            ),
          ).size,
        ),
      },
    ];
  }

  get recommendation() {
    const [firstProduct, ...remainingProducts] = this.comparedProducts;

    if (!firstProduct) {
      return undefined;
    }

    return remainingProducts.reduce(
      (best, product) => (this.getTotalStock(product) > this.getTotalStock(best) ? product : best),
      firstProduct,
    );
  }

  get productOptions(): readonly CompareOption[] {
    return this.products.map((product) => ({
      id: product.id,
      label: product.name,
    }));
  }

  get quotePath() {
    const params = new URLSearchParams();

    if (this.recommendation) {
      params.set('plan', this.recommendation.id);
    }

    if (this.selectedRegionId !== 'all') {
      params.set('region', this.selectedRegionId);
    }

    const query = params.toString();

    return query.length > 0 ? `/quote?${query}` : '/quote';
  }

  get regionOptions(): readonly CompareOption[] {
    const regions = this.products.flatMap((product) => product.availabilityByRegion);
    const byId = new Map(regions.map((region) => [region.regionId, region.regionLabel]));

    return [
      { id: 'all', label: 'All regions' },
      ...[...byId.entries()].map(([id, label]) => ({ id, label })),
    ];
  }

  get selectedRegionLabel() {
    return (
      this.regionOptions.find((region) => region.id === this.selectedRegionId)?.label ??
      'All regions'
    );
  }

  get hasNoComparedProducts() {
    return this.comparedProducts.length === 0;
  }

  get bestFitRows() {
    return this.comparedProducts.map((product) => ({
      id: product.id,
      label: product.name,
      region: this.getBestRegionLabel(product),
      setup: `${this.getFastestSetup(product)}h setup`,
      stock: `${this.getTotalStock(product)} units`,
    }));
  }

  resetComparison() {
    this.selectedProductIds = this.products.slice(0, 4).map((product) => product.id);
    this.selectedRegionId = 'all';
    this.stockOnly = true;
  }

  setRegion(regionId: string) {
    this.selectedRegionId = this.regionOptions.some((region) => region.id === regionId)
      ? regionId
      : 'all';
  }

  setStockOnly(value: boolean) {
    this.stockOnly = value;
  }

  toggleProduct(productId: string) {
    if (this.selectedProductIds.includes(productId)) {
      this.selectedProductIds = this.selectedProductIds.filter((id) => id !== productId);
      return;
    }

    if (this.selectedProductIds.length >= 4) {
      this.selectedProductIds = [...this.selectedProductIds.slice(1), productId];
      return;
    }

    this.selectedProductIds = [...this.selectedProductIds, productId];
  }

  private getFastestSetup(product: CatalogProduct) {
    const setupHours = this.getMatchingRegions(product).map((region) => region.setupHours);

    return setupHours.length > 0 ? Math.min(...setupHours) : 0;
  }

  private get selectedProductIdSet(): ReadonlySet<string> {
    return new Set(this.selectedProductIds);
  }

  private getTotalStock(product: CatalogProduct) {
    return this.getMatchingRegions(product).reduce((total, region) => total + region.stock, 0);
  }

  private getBestRegionLabel(product: CatalogProduct) {
    const [firstRegion, ...remainingRegions] = this.getMatchingRegions(product);

    if (!firstRegion) {
      return 'No matching stock';
    }

    return remainingRegions.reduce(
      (best, region) => (region.stock > best.stock ? region : best),
      firstRegion,
    ).regionLabel;
  }

  private getMatchingRegions(product: CatalogProduct) {
    return product.availabilityByRegion.filter((region) => {
      const matchesRegion =
        this.selectedRegionId === 'all' || region.regionId === this.selectedRegionId;
      const matchesStock = !this.stockOnly || region.stock > 0;

      return matchesRegion && matchesStock;
    });
  }

  private matchesRegion(product: CatalogProduct) {
    return this.getMatchingRegions(product).length > 0;
  }
}
