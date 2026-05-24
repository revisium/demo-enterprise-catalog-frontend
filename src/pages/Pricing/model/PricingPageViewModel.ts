import { makeAutoObservable } from 'mobx';

import type { CatalogProduct, CatalogRegionAvailability } from 'src/entities/catalog';
import { PricingPageDataSource } from '../api/PricingPageDataSource';

type BillingTermId = 'monthly' | 'yearly';
type PricingSortId = 'monthly' | 'ram' | 'recently-updated' | 'setup' | 'stock';

interface FilterOption {
  readonly id: string;
  readonly label: string;
}

interface PricingRow {
  readonly billingTermPrice: number;
  readonly family: string;
  readonly id: string;
  readonly plan: CatalogProduct;
  readonly region: CatalogRegionAvailability;
}

const sortOptions: readonly FilterOption[] = [
  { id: 'monthly', label: 'Lowest effective price' },
  { id: 'stock', label: 'Most regional stock' },
  { id: 'setup', label: 'Fastest setup' },
  { id: 'ram', label: 'Most memory' },
  { id: 'recently-updated', label: 'Recently updated' },
];

const priceOptions: readonly FilterOption[] = [
  { id: '0', label: 'Any price' },
  { id: '100', label: 'Up to $100/mo' },
  { id: '250', label: 'Up to $250/mo' },
  { id: '400', label: 'Up to $400/mo' },
  { id: '600', label: 'Up to $600/mo' },
];

export class PricingPageViewModel {
  private readonly dataSource = new PricingPageDataSource();

  billingTermId: BillingTermId = 'monthly';
  maxMonthlyPrice = 0;
  selectedFamilyIds: readonly string[] = [];
  selectedRegionIds: readonly string[] = [];
  selectedRowIds: readonly string[] = [];
  sortId: PricingSortId = 'monthly';
  stockOnly = true;

  constructor() {
    makeAutoObservable(this);
  }

  get products() {
    return this.dataSource.getProducts();
  }

  get rows(): readonly PricingRow[] {
    return this.products.flatMap((plan) =>
      plan.availabilityByRegion.map((region) => ({
        billingTermPrice:
          this.billingTermId === 'yearly' ? plan.pricing.yearlyMonthlyUsd : plan.pricing.monthlyUsd,
        family: plan.family,
        id: `${plan.id}:${region.regionId}`,
        plan,
        region,
      })),
    );
  }

  get filteredRows(): readonly PricingRow[] {
    return [...this.rows.filter((row) => this.matchesRow(row))].sort((left, right) =>
      this.compareRows(left, right),
    );
  }

  get families(): readonly FilterOption[] {
    return [...new Set(this.products.map((product) => product.family))].map((family) => ({
      id: family,
      label: family,
    }));
  }

  get priceOptions() {
    return priceOptions;
  }

  get regions(): readonly FilterOption[] {
    const regions = this.rows.map((row) => row.region);
    const byId = new Map(regions.map((region) => [region.regionId, region.regionLabel]));

    return [...byId.entries()].map(([id, label]) => ({ id, label }));
  }

  get sortOptions() {
    return sortOptions;
  }

  get hasNoMatches() {
    return this.filteredRows.length === 0;
  }

  get selectedRows(): readonly PricingRow[] {
    return this.rows.filter((row) => this.selectedRowIdSet.has(row.id));
  }

  get quoteSummary() {
    const selectedRows = this.selectedRows;
    const monthlyTotal = selectedRows.reduce((total, row) => total + row.billingTermPrice, 0);
    const setupTotal = selectedRows.reduce((total, row) => total + row.plan.pricing.setupUsd, 0);
    const regions = new Set(selectedRows.map((row) => row.region.regionId)).size;

    return [
      { label: 'Selected rows', value: String(selectedRows.length) },
      { label: 'Monthly total', value: `$${monthlyTotal}` },
      { label: 'Setup total', value: `$${setupTotal}` },
      { label: 'Regions', value: String(regions) },
    ];
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
    ];
  }

  setBillingTerm(termId: BillingTermId) {
    this.billingTermId = termId;
  }

  resetFilters() {
    this.billingTermId = 'monthly';
    this.maxMonthlyPrice = 0;
    this.selectedFamilyIds = [];
    this.selectedRegionIds = [];
    this.selectedRowIds = [];
    this.sortId = 'monthly';
    this.stockOnly = true;
  }

  setMaxMonthlyPrice(value: string) {
    this.maxMonthlyPrice = this.parseNonNegativeNumber(value);
  }

  setSort(sortId: string) {
    this.sortId = this.isSortId(sortId) ? sortId : 'monthly';
  }

  setStockOnly(value: boolean) {
    this.stockOnly = value;
  }

  isRowSelected(rowId: string) {
    return this.selectedRowIdSet.has(rowId);
  }

  removeSelectedRow(rowId: string) {
    this.selectedRowIds = this.selectedRowIds.filter((id) => id !== rowId);
  }

  toggleRow(rowId: string) {
    this.selectedRowIds = this.toggleValue(this.selectedRowIds, rowId);
  }

  toggleFamily(familyId: string) {
    this.selectedFamilyIds = this.toggleValue(this.selectedFamilyIds, familyId);
  }

  toggleRegion(regionId: string) {
    this.selectedRegionIds = this.toggleValue(this.selectedRegionIds, regionId);
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

    return left.billingTermPrice - right.billingTermPrice;
  }

  private isSortId(value: string): value is PricingSortId {
    return sortOptions.some((option) => option.id === value);
  }

  private get selectedRowIdSet(): ReadonlySet<string> {
    return new Set(this.selectedRowIds);
  }

  private matchesRow(row: PricingRow) {
    const matchesFamily =
      this.selectedFamilyIds.length === 0 || this.selectedFamilyIds.includes(row.family);
    const matchesRegion =
      this.selectedRegionIds.length === 0 || this.selectedRegionIds.includes(row.region.regionId);
    const matchesPrice = this.maxMonthlyPrice === 0 || row.billingTermPrice <= this.maxMonthlyPrice;
    const matchesStock = !this.stockOnly || row.region.stock > 0;

    return matchesFamily && matchesRegion && matchesPrice && matchesStock;
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
