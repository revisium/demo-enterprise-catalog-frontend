import { makeAutoObservable } from 'mobx';

import {
  calculateCatalogReadinessScore,
  calculatePriceEfficiencyScore,
  getFastestSetupHours,
  type CatalogProduct,
  type CatalogRegionAvailability,
} from 'src/entities/catalog';
import { ProductDetailPageDataSource } from '../api/ProductDetailPageDataSource';

type RegionSortId = 'fastest-setup' | 'readiness' | 'region-name' | 'stock';
type AlternativeSortId = 'monthly-price' | 'price-efficiency' | 'recently-updated' | 'stock';

interface FilterOption {
  readonly id: string;
  readonly label: string;
}

interface ProductRegionRow extends CatalogRegionAvailability {
  readonly locationHref: string;
  readonly readinessScore: number;
}

interface AlternativeProductRow {
  readonly detailHref: string;
  readonly displayUpdatedDate: string;
  readonly overlapRegionCount: number;
  readonly plan: CatalogProduct;
  readonly priceDeltaLabel: string;
  readonly priceEfficiencyScore: number;
  readonly totalStock: number;
}

interface AlternativeCandidate {
  readonly overlapRegionCount: number;
  readonly plan: CatalogProduct;
}

const regionSortOptions: readonly FilterOption[] = [
  { id: 'readiness', label: 'Best readiness' },
  { id: 'stock', label: 'Most stock' },
  { id: 'fastest-setup', label: 'Fastest setup' },
  { id: 'region-name', label: 'Region name' },
];

const alternativeSortOptions: readonly FilterOption[] = [
  { id: 'price-efficiency', label: 'Best price efficiency' },
  { id: 'monthly-price', label: 'Lowest monthly price' },
  { id: 'stock', label: 'Most stock' },
  { id: 'recently-updated', label: 'Recently updated' },
];

export class ProductDetailPageViewModel {
  private static readonly dateFormat = new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
  });

  private readonly dataSource = new ProductDetailPageDataSource();

  alternativeSortId: AlternativeSortId = 'price-efficiency';
  inStockRegionsOnly = true;
  regionSortId: RegionSortId = 'readiness';
  productId: string | undefined;

  constructor(productId: string | undefined) {
    this.productId = productId;
    makeAutoObservable(this);
  }

  get product() {
    return this.dataSource.getProduct(this.productId);
  }

  get products() {
    return this.dataSource.getProducts();
  }

  get quotePath() {
    return `/quote?plan=${this.product.id}`;
  }

  get fastestSetupHours() {
    return getFastestSetupHours(
      this.product.availabilityByRegion.map((region) => region.setupHours),
    );
  }

  get summaryMetrics() {
    return [
      { label: 'Monthly', value: `$${this.product.pricing.monthlyUsd}` },
      { label: 'Total stock', value: String(this.totalStock) },
      { label: 'Fastest setup', value: `${this.fastestSetupHours}h` },
      { label: 'Price efficiency', value: String(this.priceEfficiencyScore) },
    ];
  }

  get totalStock() {
    return this.product.availabilityByRegion.reduce((total, region) => total + region.stock, 0);
  }

  get priceEfficiencyScore() {
    return calculatePriceEfficiencyScore(this.product);
  }

  get commercialTermLabel() {
    return `$${this.product.pricing.yearlyMonthlyUsd}/mo on yearly term · $${this.product.pricing.setupUsd} setup fee.`;
  }

  get regionRows(): readonly ProductRegionRow[] {
    const enterpriseCoveragePercent = this.product.supportTier === 'Enterprise' ? 100 : 0;

    return this.product.availabilityByRegion.map((region) => ({
      ...region,
      locationHref: `/locations/${region.regionId}`,
      readinessScore: calculateCatalogReadinessScore({
        enterpriseCoveragePercent,
        familyCoveragePercent: 100,
        fastestSetupHours: region.setupHours,
        totalStock: region.stock,
      }),
    }));
  }

  get visibleRegionRows(): readonly ProductRegionRow[] {
    return [...this.regionRows.filter((row) => !this.inStockRegionsOnly || row.stock > 0)].sort(
      (left, right) => this.compareRegionRows(left, right),
    );
  }

  get hasNoRegionMatches() {
    return this.visibleRegionRows.length === 0;
  }

  get alternativeRows(): readonly AlternativeProductRow[] {
    return this.sortedAlternativeCandidates
      .slice(0, 4)
      .map((candidate) => this.toAlternativeRow(candidate));
  }

  private get alternativeCandidates(): readonly AlternativeCandidate[] {
    const productRegionIds = new Set(
      this.product.availabilityByRegion.map((region) => region.regionId),
    );

    return this.products
      .filter((product) => product.id !== this.product.id)
      .map((plan) => {
        const overlapRegionCount = plan.availabilityByRegion.filter((region) =>
          productRegionIds.has(region.regionId),
        ).length;

        return {
          overlapRegionCount,
          plan,
        };
      })
      .filter(
        (candidate) =>
          candidate.plan.family === this.product.family || candidate.overlapRegionCount > 0,
      );
  }

  private get sortedAlternativeCandidates() {
    return [...this.alternativeCandidates].sort((left, right) =>
      this.compareAlternativeCandidates(left, right),
    );
  }

  get regionSortOptions() {
    return regionSortOptions;
  }

  get alternativeSortOptions() {
    return alternativeSortOptions;
  }

  get queryRows() {
    return [
      {
        label: 'Region view',
        value: this.inStockRegionsOnly ? 'available only' : 'all regions',
      },
      {
        label: 'Region sort',
        value: this.getOptionLabel(regionSortOptions, this.regionSortId),
      },
      {
        label: 'Alternatives',
        value: this.getOptionLabel(alternativeSortOptions, this.alternativeSortId),
      },
      {
        label: 'Updated',
        value: this.formatDate(this.product.system.updatedAt),
      },
    ];
  }

  formatDate(value: string) {
    return ProductDetailPageViewModel.dateFormat.format(new Date(value));
  }

  setAlternativeSort(sortId: string) {
    this.alternativeSortId = this.isAlternativeSortId(sortId) ? sortId : 'price-efficiency';
  }

  setInStockRegionsOnly(value: boolean) {
    this.inStockRegionsOnly = value;
  }

  setRegionSort(sortId: string) {
    this.regionSortId = this.isRegionSortId(sortId) ? sortId : 'readiness';
  }

  private compareAlternativeCandidates(left: AlternativeCandidate, right: AlternativeCandidate) {
    if (this.alternativeSortId === 'monthly-price') {
      return left.plan.pricing.monthlyUsd - right.plan.pricing.monthlyUsd;
    }

    if (this.alternativeSortId === 'stock') {
      return this.getTotalStock(right.plan) - this.getTotalStock(left.plan);
    }

    if (this.alternativeSortId === 'recently-updated') {
      return Date.parse(right.plan.system.updatedAt) - Date.parse(left.plan.system.updatedAt);
    }

    return calculatePriceEfficiencyScore(right.plan) - calculatePriceEfficiencyScore(left.plan);
  }

  private compareRegionRows(left: ProductRegionRow, right: ProductRegionRow) {
    if (this.regionSortId === 'stock') {
      return right.stock - left.stock;
    }

    if (this.regionSortId === 'fastest-setup') {
      return left.setupHours - right.setupHours;
    }

    if (this.regionSortId === 'region-name') {
      return left.regionLabel.localeCompare(right.regionLabel);
    }

    return right.readinessScore - left.readinessScore;
  }

  private getOptionLabel(options: readonly FilterOption[], id: string) {
    return options.find((option) => option.id === id)?.label ?? id;
  }

  private formatPriceDelta(value: number) {
    if (value === 0) {
      return 'same price';
    }

    return `${value > 0 ? '+' : '-'}$${Math.abs(value)}/mo`;
  }

  private getTotalStock(product: CatalogProduct) {
    return product.availabilityByRegion.reduce((total, region) => total + region.stock, 0);
  }

  private toAlternativeRow(candidate: AlternativeCandidate): AlternativeProductRow {
    const priceDelta = candidate.plan.pricing.monthlyUsd - this.product.pricing.monthlyUsd;

    return {
      detailHref: `/catalog/${candidate.plan.id}`,
      displayUpdatedDate: this.formatDate(candidate.plan.system.updatedAt),
      overlapRegionCount: candidate.overlapRegionCount,
      plan: candidate.plan,
      priceDeltaLabel: this.formatPriceDelta(priceDelta),
      priceEfficiencyScore: calculatePriceEfficiencyScore(candidate.plan),
      totalStock: this.getTotalStock(candidate.plan),
    };
  }

  private isAlternativeSortId(value: string): value is AlternativeSortId {
    return alternativeSortOptions.some((option) => option.id === value);
  }

  private isRegionSortId(value: string): value is RegionSortId {
    return regionSortOptions.some((option) => option.id === value);
  }
}
