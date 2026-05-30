import { makeAutoObservable } from 'mobx';

import type { CatalogProduct } from 'src/entities/catalog';
import {
  buildCatalogSearch,
  CATALOG_SORT_URL_TO_VM,
  CATALOG_SORT_VM_TO_URL,
  parseCatalogParams,
} from 'src/shared/routing';
import { CatalogPageDataSource } from '../api/CatalogPageDataSource';

type CatalogFilterMode = 'all' | 'any';
type CatalogSortId =
  | 'display-order'
  | 'monthly-price'
  | 'ram'
  | 'recently-updated'
  | 'stock'
  | 'yearly-price';

type CatalogProductRow = CatalogProduct & {
  readonly detailHref: string;
  readonly displayUpdatedDate: string;
  readonly documentCount: number;
  readonly effectivePrice: number;
  readonly maxSetupHours: number;
  readonly totalStock: number;
};

interface FilterOption {
  readonly id: string;
  readonly label: string;
}

const sortOptions: readonly FilterOption[] = [
  { id: 'display-order', label: 'Catalog order' },
  { id: 'recently-updated', label: 'Recently updated' },
  { id: 'monthly-price', label: 'Lowest monthly price' },
  { id: 'yearly-price', label: 'Lowest yearly price' },
  { id: 'ram', label: 'Most memory' },
  { id: 'stock', label: 'Most stock' },
];

const ramOptions: readonly FilterOption[] = [
  { id: '0', label: 'Any memory' },
  { id: '32', label: '32 GB+' },
  { id: '64', label: '64 GB+' },
  { id: '128', label: '128 GB+' },
  { id: '192', label: '192 GB+' },
];

const priceOptions: readonly FilterOption[] = [
  { id: '0', label: 'Any price' },
  { id: '100', label: 'Up to $100/mo' },
  { id: '250', label: 'Up to $250/mo' },
  { id: '400', label: 'Up to $400/mo' },
  { id: '600', label: 'Up to $600/mo' },
];

export class CatalogPageViewModel {
  private readonly dataSource = new CatalogPageDataSource();

  selectedAddonIds: readonly string[] = [];
  selectedFamilyIds: readonly string[] = [];
  selectedLifecycleIds: readonly string[] = [];
  selectedRegionIds: readonly string[] = [];
  selectedSupportTierIds: readonly string[] = [];
  filterMode: CatalogFilterMode = 'all';
  maxMonthlyPrice = 0;
  minRamGb = 0;
  requireDocuments = false;
  sortId: CatalogSortId = 'display-order';
  stockOnly = false;

  constructor() {
    makeAutoObservable(this);
  }

  get products(): readonly CatalogProductRow[] {
    return this.dataSource.getProducts().map((product) => ({
      ...product,
      detailHref: `/catalog/${product.id}`,
      displayUpdatedDate: new Intl.DateTimeFormat('en', {
        day: 'numeric',
        month: 'short',
      }).format(new Date(product.system.updatedAt)),
      documentCount: product.documents.length,
      effectivePrice: product.pricing.monthlyUsd,
      maxSetupHours: product.availabilityByRegion.reduce(
        (max, region) => Math.max(max, region.setupHours),
        0,
      ),
      totalStock: product.availabilityByRegion.reduce((total, region) => total + region.stock, 0),
    }));
  }

  get filteredProducts(): readonly CatalogProductRow[] {
    return [...this.products.filter((product) => this.matchesProduct(product))].sort(
      (left, right) => this.compareProducts(left, right),
    );
  }

  get filteredTotalStock() {
    return this.filteredProducts.reduce((total, product) => total + product.totalStock, 0);
  }

  get hasNoMatches() {
    return this.filteredProducts.length === 0;
  }

  get families(): readonly FilterOption[] {
    return [...new Set(this.products.map((product) => product.family))].map((family) => ({
      id: family,
      label: family,
    }));
  }

  get regions(): readonly FilterOption[] {
    const regions = this.products.flatMap((product) => product.availabilityByRegion);
    const byId = new Map(regions.map((region) => [region.regionId, region.regionLabel]));

    return [...byId.entries()].map(([id, label]) => ({ id, label }));
  }

  get lifecycles(): readonly FilterOption[] {
    return [...new Set(this.products.map((product) => product.lifecycle))].map((lifecycle) => ({
      id: lifecycle,
      label: lifecycle,
    }));
  }

  get supportTiers(): readonly FilterOption[] {
    return [...new Set(this.products.map((product) => product.supportTier))].map((tier) => ({
      id: tier,
      label: tier,
    }));
  }

  get addons(): readonly FilterOption[] {
    return [...new Set(this.products.flatMap((product) => product.addons))]
      .sort((left, right) => left.localeCompare(right))
      .map((addon) => ({ id: addon, label: this.formatAddon(addon) }));
  }

  get sortOptions() {
    return sortOptions;
  }

  get ramOptions() {
    return ramOptions;
  }

  get priceOptions() {
    return priceOptions;
  }

  get activeFilterCount() {
    return (
      this.selectedFamilyIds.length +
      this.selectedRegionIds.length +
      this.selectedAddonIds.length +
      this.selectedLifecycleIds.length +
      this.selectedSupportTierIds.length +
      (this.minRamGb > 0 ? 1 : 0) +
      (this.maxMonthlyPrice > 0 ? 1 : 0) +
      (this.stockOnly ? 1 : 0) +
      (this.requireDocuments ? 1 : 0)
    );
  }

  get hasUserFilters() {
    return (
      this.activeFilterCount > 0 || this.filterMode !== 'all' || this.sortId !== 'display-order'
    );
  }
  setFilterMode(mode: CatalogFilterMode) {
    this.filterMode = mode;
  }

  resetFilters() {
    this.selectedAddonIds = [];
    this.selectedFamilyIds = [];
    this.selectedLifecycleIds = [];
    this.selectedRegionIds = [];
    this.selectedSupportTierIds = [];
    this.filterMode = 'all';
    this.maxMonthlyPrice = 0;
    this.minRamGb = 0;
    this.requireDocuments = false;
    this.sortId = 'display-order';
    this.stockOnly = false;
  }

  applyUrlParams(search: string) {
    const p = parseCatalogParams(search);
    this.selectedFamilyIds = p.family;
    this.selectedRegionIds = p.region;
    this.selectedAddonIds = p.cap;
    this.filterMode = p.match;
    this.minRamGb = p.ram;
    this.maxMonthlyPrice = p.price;
    this.stockOnly = p.stock;
    this.sortId = (CATALOG_SORT_URL_TO_VM[p.sort] as CatalogSortId) ?? 'display-order';
  }

  toUrlSearch(): string {
    return buildCatalogSearch({
      family: this.selectedFamilyIds,
      region: this.selectedRegionIds,
      cap: this.selectedAddonIds,
      match: this.filterMode,
      ram: this.minRamGb,
      price: this.maxMonthlyPrice,
      stock: this.stockOnly,
      sort: CATALOG_SORT_VM_TO_URL[this.sortId] ?? 'order',
    });
  }

  setMaxMonthlyPrice(value: string) {
    this.maxMonthlyPrice = this.parseNonNegativeNumber(value);
  }

  setMinRamGb(value: string) {
    this.minRamGb = this.parseNonNegativeNumber(value);
  }

  setRequireDocuments(value: boolean) {
    this.requireDocuments = value;
  }

  setSort(sortId: string) {
    this.sortId = this.isSortId(sortId) ? sortId : 'display-order';
  }

  setStockOnly(value: boolean) {
    this.stockOnly = value;
  }

  toggleAddon(addonId: string) {
    this.selectedAddonIds = this.toggleValue(this.selectedAddonIds, addonId);
  }

  toggleFamily(familyId: string) {
    this.selectedFamilyIds = this.toggleValue(this.selectedFamilyIds, familyId);
  }

  toggleLifecycle(lifecycleId: string) {
    this.selectedLifecycleIds = this.toggleValue(this.selectedLifecycleIds, lifecycleId);
  }

  toggleRegion(regionId: string) {
    this.selectedRegionIds = this.toggleValue(this.selectedRegionIds, regionId);
  }

  toggleSupportTier(tierId: string) {
    this.selectedSupportTierIds = this.toggleValue(this.selectedSupportTierIds, tierId);
  }

  private compareProducts(left: CatalogProductRow, right: CatalogProductRow) {
    if (this.sortId === 'recently-updated') {
      return Date.parse(right.system.updatedAt) - Date.parse(left.system.updatedAt);
    }

    if (this.sortId === 'monthly-price') {
      return left.pricing.monthlyUsd - right.pricing.monthlyUsd;
    }

    if (this.sortId === 'yearly-price') {
      return left.pricing.yearlyMonthlyUsd - right.pricing.yearlyMonthlyUsd;
    }

    if (this.sortId === 'ram') {
      return right.hardware.ramGb - left.hardware.ramGb;
    }

    if (this.sortId === 'stock') {
      return right.totalStock - left.totalStock;
    }

    return left.system.displayOrder - right.system.displayOrder;
  }

  private formatAddon(addon: string) {
    return addon
      .split('-')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private isSortId(value: string): value is CatalogSortId {
    return sortOptions.some((option) => option.id === value);
  }

  private matchesProduct(product: CatalogProductRow) {
    const groupedRules = [
      this.selectedFamilyIds.length === 0 ? undefined : this.matchesFamily(product),
      this.selectedRegionIds.length === 0 ? undefined : this.matchesRegion(product),
      this.selectedAddonIds.length === 0 ? undefined : this.matchesAddon(product),
      this.selectedLifecycleIds.length === 0 ? undefined : this.matchesLifecycle(product),
      this.selectedSupportTierIds.length === 0 ? undefined : this.matchesSupportTier(product),
    ].filter((rule): rule is boolean => typeof rule === 'boolean');

    const constraintRules = [
      this.matchesRam(product),
      this.matchesPrice(product),
      this.matchesStock(product),
      this.matchesDocuments(product),
    ];

    if (groupedRules.length === 0) {
      return constraintRules.every(Boolean);
    }

    const matchesGroupedRules =
      this.filterMode === 'any' ? groupedRules.some(Boolean) : groupedRules.every(Boolean);

    return matchesGroupedRules && constraintRules.every(Boolean);
  }

  private matchesAddon(product: CatalogProductRow) {
    if (this.selectedAddonIds.length === 0) {
      return true;
    }

    return this.selectedAddonIds.some((addonId) => product.addons.includes(addonId));
  }

  private matchesDocuments(product: CatalogProductRow) {
    return !this.requireDocuments || product.documentCount > 0;
  }

  private matchesFamily(product: CatalogProductRow) {
    return this.selectedFamilyIds.length === 0 || this.selectedFamilyIds.includes(product.family);
  }

  private matchesLifecycle(product: CatalogProductRow) {
    return (
      this.selectedLifecycleIds.length === 0 ||
      this.selectedLifecycleIds.includes(product.lifecycle)
    );
  }

  private matchesPrice(product: CatalogProductRow) {
    return this.maxMonthlyPrice === 0 || product.pricing.monthlyUsd <= this.maxMonthlyPrice;
  }

  private matchesRam(product: CatalogProductRow) {
    return this.minRamGb === 0 || product.hardware.ramGb >= this.minRamGb;
  }

  private matchesRegion(product: CatalogProductRow) {
    if (this.selectedRegionIds.length === 0) {
      return true;
    }

    return this.selectedRegionIds.some((regionId) =>
      product.availabilityByRegion.some((region) => region.regionId === regionId),
    );
  }

  private matchesStock(product: CatalogProductRow) {
    return !this.stockOnly || product.totalStock > 0;
  }

  private matchesSupportTier(product: CatalogProductRow) {
    return (
      this.selectedSupportTierIds.length === 0 ||
      this.selectedSupportTierIds.includes(product.supportTier)
    );
  }

  private parseNonNegativeNumber(value: string) {
    const parsed = Number(value);

    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }

  private toggleValue(values: readonly string[], value: string) {
    if (values.includes(value)) {
      return values.filter((item) => item !== value);
    }

    return [...values, value];
  }
}
