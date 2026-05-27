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
  readonly quoteHref: string;
  readonly readinessScore: number;
}

interface AlternativeProductRow {
  readonly detailHref: string;
  readonly displayUpdatedDate: string;
  readonly overlapRegionCount: number;
  readonly plan: CatalogProduct;
  readonly priceDeltaLabel: string;
  readonly priceEfficiencyScore: number;
  readonly quoteHref: string;
  readonly totalStock: number;
}

interface AlternativeCandidate {
  readonly overlapRegionCount: number;
  readonly plan: CatalogProduct;
}

interface AddOnRow {
  readonly href: string;
  readonly id: string;
  readonly label: string;
}

interface DocumentRow {
  readonly href: string;
  readonly id: string;
  readonly label: string;
}

const addonLabels = new Map([
  ['backup', 'Managed backups'],
  ['ipv4', 'Public IPv4'],
  ['lifecycle-rules', 'Lifecycle rules'],
  ['monitoring', 'Monitoring'],
  ['private-vlan', 'Private VLAN'],
  ['support', 'Priority support'],
]);

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
    return this.createQuotePath(this.product.id, this.defaultQuoteRegionId);
  }

  get defaultQuoteRegionId() {
    return this.visibleRegionRows[0]?.regionId ?? this.regionRows[0]?.regionId ?? '';
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

  get addOnRows(): readonly AddOnRow[] {
    return this.uniqueByHref(
      this.product.addons.map((addonId) => ({
        href: this.getAddOnHref(addonId),
        id: addonId,
        label: addonLabels.get(addonId) ?? addonId,
      })),
    );
  }

  get documentRows(): readonly DocumentRow[] {
    return this.uniqueByHref(
      this.product.documents.map((label) => ({
        href: this.getDocumentHref(label),
        id: label,
        label,
      })),
    );
  }

  get packageRows() {
    return [
      { label: 'Support tier', value: this.product.supportTier },
      { label: 'Billing terms', value: this.product.billingTerms.join(', ') },
      { label: 'Compliance', value: this.product.compliance.join(', ') || 'standard terms' },
      { label: 'Documents', value: `${this.product.documents.length} files` },
    ];
  }

  get technicalRows() {
    return [
      { label: 'Platform', value: this.product.specs.enclosure },
      { label: 'Security', value: this.product.specs.ingress },
      { label: 'SLA', value: this.product.specs.operatingRange },
      { label: 'Network', value: this.product.specs.connectivity },
    ];
  }

  get regionRows(): readonly ProductRegionRow[] {
    const enterpriseCoveragePercent = this.product.supportTier === 'Enterprise' ? 100 : 0;

    return this.product.availabilityByRegion.map((region) => ({
      ...region,
      locationHref: `/locations/${region.regionId}`,
      quoteHref: this.createQuotePath(this.product.id, region.regionId),
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
        label: 'Availability view',
        value: this.inStockRegionsOnly ? 'available only' : 'all regions',
      },
      {
        label: 'Region sort',
        value: this.getOptionLabel(regionSortOptions, this.regionSortId),
      },
      {
        label: 'Alternative sort',
        value: this.getOptionLabel(alternativeSortOptions, this.alternativeSortId),
      },
      {
        label: 'Updated',
        value: this.formatDate(this.product.system.updatedAt),
      },
    ];
  }

  createQuotePath(planId: string, regionId: string) {
    const params = new URLSearchParams({
      plan: planId,
      term: 'monthly',
    });

    if (regionId) {
      params.set('region', regionId);
    }

    return `/quote?${params.toString()}`;
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

  private getAddOnHref(addonId: string) {
    if (addonId === 'support') {
      return this.quotePath;
    }

    if (addonId === 'backup') {
      return '/pricing';
    }

    if (addonId === 'monitoring') {
      return '/resources/backup-and-restore-policy';
    }

    if (addonId === 'ipv4') {
      return '/pricing';
    }

    if (addonId === 'private-vlan') {
      return '/resources/network-options-by-region';
    }

    if (addonId === 'lifecycle-rules') {
      return '/resources/choose-production-server-plan';
    }

    return '/resources';
  }

  private getDocumentHref(label: string) {
    const normalized = label.toLowerCase();

    if (normalized.includes('network')) {
      return '/resources/network-options-by-region';
    }

    if (normalized.includes('backup')) {
      return '/resources/backup-and-restore-policy';
    }

    if (normalized.includes('billing') || normalized.includes('terms')) {
      return '/resources/access-review-checklist';
    }

    if (normalized.includes('api')) {
      return '/resources/partner-api-overview';
    }

    return '/resources/choose-production-server-plan';
  }

  private uniqueByHref<Row extends { readonly href: string }>(rows: readonly Row[]) {
    const uniqueRows: Row[] = [];
    const hrefs = new Set<string>();

    rows.forEach((row) => {
      if (hrefs.has(row.href)) {
        return;
      }

      hrefs.add(row.href);
      uniqueRows.push(row);
    });

    return uniqueRows;
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
      quoteHref: this.createQuotePath(
        candidate.plan.id,
        candidate.plan.availabilityByRegion[0]?.regionId ?? '',
      ),
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
