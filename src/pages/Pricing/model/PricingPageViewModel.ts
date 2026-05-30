import { makeAutoObservable } from 'mobx';

import {
  calculateCatalogPlanValues,
  valueTierOrder,
  type CatalogProduct,
  type CatalogRegionAvailability,
  type CatalogValueTier,
} from 'src/entities/catalog';
import { priceBooks } from 'src/entities/pricing';
import { PricingPageDataSource } from '../api/PricingPageDataSource';

type BillingTermId = 'monthly' | 'yearly';
type PricingSortId =
  | 'display-order'
  | 'effective-price'
  | 'most-value'
  | 'ram'
  | 'recently-updated'
  | 'setup'
  | 'stock'
  | 'yearly-savings';

interface FilterOption {
  readonly id: string;
  readonly label: string;
}

interface PricingRow {
  readonly billingTermPrice: number;
  readonly detailHref: string;
  readonly family: string;
  readonly id: string;
  readonly pricePerCore: number | null;
  readonly pricePerGbRam: number | null;
  readonly plan: CatalogProduct;
  readonly regionsInStock: number;
  readonly region: CatalogRegionAvailability;
  readonly valueTier: CatalogValueTier;
  readonly yearlySavingsUsd: number;
}

const addonMatchOptions: readonly FilterOption[] = [
  { id: 'any', label: 'Any add-on' },
  { id: 'all', label: 'All add-ons' },
];

const maxSetupOptions: readonly FilterOption[] = [
  { id: '0', label: 'Any setup time' },
  { id: '4', label: 'Up to 4h' },
  { id: '8', label: 'Up to 8h' },
  { id: '24', label: 'Up to 24h' },
  { id: '48', label: 'Up to 48h' },
];

const minRamOptions: readonly FilterOption[] = [
  { id: '0', label: 'Any memory' },
  { id: '16', label: '16 GB+' },
  { id: '32', label: '32 GB+' },
  { id: '64', label: '64 GB+' },
  { id: '128', label: '128 GB+' },
];

const priceOptions: readonly FilterOption[] = [
  { id: '0', label: 'Any price' },
  { id: '100', label: 'Up to $100/mo' },
  { id: '250', label: 'Up to $250/mo' },
  { id: '400', label: 'Up to $400/mo' },
  { id: '600', label: 'Up to $600/mo' },
];

const sortOptions: readonly FilterOption[] = [
  { id: 'effective-price', label: 'Lowest effective price' },
  { id: 'most-value', label: 'Best value tier' },
  { id: 'yearly-savings', label: 'Largest yearly savings' },
  { id: 'stock', label: 'Most regional stock' },
  { id: 'setup', label: 'Fastest setup' },
  { id: 'ram', label: 'Most memory' },
  { id: 'display-order', label: 'Catalog order' },
  { id: 'recently-updated', label: 'Recently updated' },
];

const valueTierLabel: Record<CatalogValueTier, string> = {
  Economy: 'Economy',
  Balanced: 'Balanced',
  Performance: 'Performance',
};

export class PricingPageViewModel {
  private readonly dataSource = new PricingPageDataSource();

  addonMatchMode: 'all' | 'any' = 'any';
  billingTermId: BillingTermId = 'monthly';
  maxMonthlyPrice = 0;
  maxSetupHours = 0;
  minRamGb = 0;
  selectedAddonIds: readonly string[] = [];
  selectedFamilyIds: readonly string[] = [];
  selectedRegionIds: readonly string[] = [];
  selectedRowIds: readonly string[] = [];
  selectedSupportWindows: readonly string[] = [];
  sortId: PricingSortId = 'effective-price';
  stockOnly = true;

  constructor() {
    makeAutoObservable(this);
  }

  get products() {
    return this.dataSource.getProducts();
  }

  get rows(): readonly PricingRow[] {
    return this.products.flatMap((plan) =>
      plan.availabilityByRegion.map((region) => this.toPricingRow(plan, region)),
    );
  }

  get filteredRows(): readonly PricingRow[] {
    return [...this.rows.filter((row) => this.matchesRow(row))].sort((left, right) =>
      this.compareRows(left, right),
    );
  }

  get selectedRows(): readonly PricingRow[] {
    return this.rows.filter((row) => this.selectedRowIdSet.has(row.id));
  }

  get regions(): readonly { readonly id: string; readonly label: string }[] {
    const seen = new Map<string, string>();
    for (const row of this.rows) {
      if (!seen.has(row.region.regionId)) {
        seen.set(row.region.regionId, row.region.regionLabel);
      }
    }
    return [...seen.entries()].map(([id, label]) => ({ id, label }));
  }

  get addOnMatchOptions() {
    return addonMatchOptions;
  }

  get activePriceBook() {
    const book = this.priceBooks.find((item) => item.status === 'Active') ?? this.priceBooks[0];

    if (!book) {
      throw new Error('Price book mock data is empty');
    }

    return book;
  }

  get addons(): readonly FilterOption[] {
    return [...new Set(this.products.flatMap((product) => product.addons))]
      .sort((left, right) => left.localeCompare(right))
      .map((addon) => ({ id: addon, label: addon }));
  }

  get families(): readonly FilterOption[] {
    return [...new Set(this.products.map((product) => product.family))]
      .sort((left, right) => left.localeCompare(right))
      .map((family) => ({ id: family, label: family }));
  }

  get hasNoMatches() {
    return this.filteredRows.length === 0;
  }

  get hasUserFilters() {
    return (
      this.addonMatchMode !== 'any' ||
      this.billingTermId !== 'monthly' ||
      this.maxMonthlyPrice > 0 ||
      this.maxSetupHours > 0 ||
      this.minRamGb > 0 ||
      this.selectedAddonIds.length > 0 ||
      this.selectedFamilyIds.length > 0 ||
      this.selectedRegionIds.length > 0 ||
      this.selectedRowIds.length > 0 ||
      this.selectedSupportWindows.length > 0 ||
      this.sortId !== 'effective-price' ||
      !this.stockOnly
    );
  }

  get maxSetupOptions() {
    return maxSetupOptions;
  }

  get minRamOptions() {
    return minRamOptions;
  }

  get priceOptions() {
    return priceOptions;
  }

  get priceBooks() {
    return priceBooks.map((book) => ({
      ...book,
      href: `/pricing/${book.id}`,
    }));
  }
  get quotePath() {
    const params = new URLSearchParams();
    const [selectedRow] = this.selectedRows;

    if (selectedRow) {
      params.set('plan', selectedRow.plan.id);
      params.set('region', selectedRow.region.regionId);
    }

    params.set('term', this.billingTermId);

    return `/quote?${params.toString()}`;
  }

  get summaryMetrics() {
    const lowestPrice =
      this.filteredRows.length === 0
        ? 0
        : Math.min(...this.filteredRows.map((row) => row.billingTermPrice));
    const bestValueTier =
      this.filteredRows.length === 0
        ? '-'
        : this.filteredRows.reduce((best, row) => {
            const current = valueTierOrder[row.valueTier];
            const existing = best === null ? 3 : valueTierOrder[best];

            if (current < existing) {
              return row.valueTier;
            }

            return best;
          }, null as CatalogValueTier | null) ?? 'Performance';

    return [
      { label: 'Price rows', value: String(this.filteredRows.length) },
      {
        label: 'Lowest price',
        value: `$${lowestPrice}`,
      },
      {
        label: 'Regional stock',
        value: String(this.filteredRows.reduce((total, row) => total + row.region.stock, 0)),
      },
      {
        label: 'Best value tier',
        value: bestValueTier in valueTierLabel ? valueTierLabel[bestValueTier as CatalogValueTier] : bestValueTier,
      },
    ];
  }

  get supportWindows(): readonly FilterOption[] {
    return [...new Set(this.rows.map((row) => row.region.supportWindow))]
      .sort((left, right) => left.localeCompare(right))
      .map((supportWindow) => ({ id: supportWindow, label: supportWindow }));
  }

  isRowSelected(rowId: string) {
    return this.selectedRowIdSet.has(rowId);
  }

  removeSelectedRow(rowId: string) {
    this.selectedRowIds = this.selectedRowIds.filter((id) => id !== rowId);
  }

  resetFilters() {
    this.addonMatchMode = 'any';
    this.billingTermId = 'monthly';
    this.maxMonthlyPrice = 0;
    this.maxSetupHours = 0;
    this.minRamGb = 0;
    this.selectedAddonIds = [];
    this.selectedFamilyIds = [];
    this.selectedRegionIds = [];
    this.selectedRowIds = [];
    this.selectedSupportWindows = [];
    this.sortId = 'effective-price';
    this.stockOnly = true;
  }

  setAddonMatchMode(value: string) {
    this.addonMatchMode = value === 'all' ? value : 'any';
  }

  setBillingTerm(termId: BillingTermId) {
    this.billingTermId = termId;
  }

  setMaxMonthlyPrice(value: string) {
    this.maxMonthlyPrice = this.parseNonNegativeNumber(value);
  }

  setMaxSetupHours(value: string) {
    this.maxSetupHours = this.parseNonNegativeNumber(value);
  }

  setMinRamGb(value: string) {
    this.minRamGb = this.parseNonNegativeNumber(value);
  }

  setSort(sortId: string) {
    this.sortId = this.isSortId(sortId) ? sortId : 'effective-price';
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

  toggleRegion(regionId: string) {
    this.selectedRegionIds = this.toggleValue(this.selectedRegionIds, regionId);
  }

  toggleRow(rowId: string) {
    this.selectedRowIds = this.toggleValue(this.selectedRowIds, rowId);
  }

  toggleSupportWindow(value: string) {
    this.selectedSupportWindows = this.toggleValue(this.selectedSupportWindows, value);
  }

  private compareRows(left: PricingRow, right: PricingRow) {
    if (this.sortId === 'stock') {
      return right.region.stock - left.region.stock;
    }

    if (this.sortId === 'setup') {
      return left.region.setupHours - right.region.setupHours;
    }

    if (this.sortId === 'ram') {
      return right.plan.hardware.ramGb - left.plan.hardware.ramGb;
    }

    if (this.sortId === 'recently-updated') {
      return Date.parse(right.plan.system.updatedAt) - Date.parse(left.plan.system.updatedAt);
    }

    if (this.sortId === 'display-order') {
      return left.plan.system.displayOrder - right.plan.system.displayOrder;
    }

    if (this.sortId === 'yearly-savings') {
      return right.yearlySavingsUsd - left.yearlySavingsUsd;
    }

    if (this.sortId === 'most-value') {
      return valueTierOrder[left.valueTier] - valueTierOrder[right.valueTier];
    }

    return left.billingTermPrice - right.billingTermPrice;
  }

  get sortOptions() {
    return sortOptions;
  }

  private isSortId(value: string): value is PricingSortId {
    return sortOptions.some((option) => option.id === value);
  }

  private get selectedRowIdSet(): ReadonlySet<string> {
    return new Set(this.selectedRowIds);
  }

  private matchesAddons(row: PricingRow) {
    if (this.selectedAddonIds.length === 0) {
      return true;
    }

    if (this.addonMatchMode === 'all') {
      return this.selectedAddonIds.every((addon) => row.plan.addons.includes(addon));
    }

    return this.selectedAddonIds.some((addon) => row.plan.addons.includes(addon));
  }

  private matchesRow(row: PricingRow) {
    const matchesFamily =
      this.selectedFamilyIds.length === 0 || this.selectedFamilyIds.includes(row.family);
    const matchesRegion =
      this.selectedRegionIds.length === 0 || this.selectedRegionIds.includes(row.region.regionId);
    const matchesSupportWindow =
      this.selectedSupportWindows.length === 0 ||
      this.selectedSupportWindows.includes(row.region.supportWindow);
    const matchesPrice = this.maxMonthlyPrice === 0 || row.billingTermPrice <= this.maxMonthlyPrice;
    const matchesRam = this.minRamGb === 0 || row.plan.hardware.ramGb >= this.minRamGb;
    const matchesSetup = this.maxSetupHours === 0 || row.region.setupHours <= this.maxSetupHours;
    const matchesStock = !this.stockOnly || row.region.stock > 0;

    return (
      matchesFamily &&
      matchesRegion &&
      matchesSupportWindow &&
      matchesPrice &&
      matchesRam &&
      matchesSetup &&
      matchesStock &&
      this.matchesAddons(row)
    );
  }

  private parseNonNegativeNumber(value: string) {
    const parsed = Number(value);

    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }

  private toPricingRow(plan: CatalogProduct, region: CatalogRegionAvailability): PricingRow {
    const computed = calculateCatalogPlanValues(plan);

    return {
      billingTermPrice:
        this.billingTermId === 'yearly' ? plan.pricing.yearlyMonthlyUsd : plan.pricing.monthlyUsd,
      detailHref: `/catalog/${plan.id}`,
      family: plan.family,
      id: `${plan.id}:${region.regionId}`,
      plan,
      pricePerCore: computed.pricePerCore,
      pricePerGbRam: computed.pricePerGbRam,
      regionsInStock: computed.regionsInStock,
      region,
      valueTier: computed.valueTier,
      yearlySavingsUsd: (plan.pricing.monthlyUsd - plan.pricing.yearlyMonthlyUsd) * 12,
    };
  }

  private toggleValue(values: readonly string[], value: string) {
    if (values.includes(value)) {
      return values.filter((item) => item !== value);
    }

    return [...values, value];
  }
}
