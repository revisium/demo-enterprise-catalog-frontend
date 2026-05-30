import { makeAutoObservable } from 'mobx';

import {
  calculateCatalogPlanValues,
  valueTierOrder,
  type CatalogProduct,
  type CatalogRegionAvailability,
  type CatalogValueTier,
} from 'src/entities/catalog';
import type { PriceBook } from 'src/entities/pricing';
import { PricingDetailPageDataSource } from '../api/PricingDetailPageDataSource';

type BillingTermId = 'monthly' | 'yearly';
type PriceBookSortId =
  | 'effective-monthly'
  | 'most-value'
  | 'recently-updated'
  | 'source-revision'
  | 'stock'
  | 'yearly-savings';

interface FilterOption {
  readonly id: string;
  readonly label: string;
}

interface PriceBookRow {
  readonly effectiveMonthlyUsd: number;
  readonly family: string;
  readonly id: string;
  readonly locationHref: string;
  readonly plan: CatalogProduct;
  readonly pricePerCore: number | null;
  readonly pricePerGbRam: number | null;
  readonly quoteHref: string;
  readonly region: CatalogRegionAvailability;
  readonly rowHref: string;
  readonly sourceRevision: number;
  readonly topRegions: readonly string[];
  readonly updatedAtDisplay: string;
  readonly valueTier: CatalogValueTier;
  readonly yearlySavingsUsd: number;
}

const valueTierOptions: readonly FilterOption[] = [
  { id: 'all', label: 'Any tier' },
  { id: '0', label: 'Economy only' },
  { id: '1', label: 'Economy or Balanced' },
  { id: '2', label: 'Any value' },
];

const sortOptions: readonly FilterOption[] = [
  { id: 'effective-monthly', label: 'Lowest effective price' },
  { id: 'most-value', label: 'Best value tier' },
  { id: 'yearly-savings', label: 'Largest yearly savings' },
  { id: 'stock', label: 'Most stock' },
  { id: 'source-revision', label: 'Latest catalog revision' },
  { id: 'recently-updated', label: 'Recently updated' },
];

export class PricingDetailPageViewModel {
  private readonly dataSource = new PricingDetailPageDataSource();

  priceBookId: string | undefined;
  selectedFamilyIds: readonly string[] = [];
  selectedRegionIds: readonly string[] = [];
  selectedTermId: BillingTermId = 'monthly';
  sortId: PriceBookSortId = 'effective-monthly';
  selectedValueTier = 'all';
  stockOnly = true;

  constructor(priceBookId: string | undefined) {
    this.priceBookId = priceBookId;
    makeAutoObservable(this);
  }

  get book(): PriceBook {
    const book =
      this.priceBookId === undefined
        ? this.priceBooks[0]
        : this.priceBooks.find((item) => item.id === this.priceBookId);

    if (!book) {
      throw new Error(
        this.priceBookId === undefined
          ? 'Price book mock data is empty'
          : `Price book not found: ${this.priceBookId}`,
      );
    }

    return book;
  }

  get valueTierOptions() {
    return valueTierOptions;
  }

  get familyOptions(): readonly FilterOption[] {
    return [...new Set(this.rows.map((row) => row.family))]
      .sort((left, right) => left.localeCompare(right))
      .map((family) => ({ id: family, label: family }));
  }

  get filteredRows(): readonly PriceBookRow[] {
    return [...this.rows.filter((row) => this.matchesRow(row))].sort((left, right) =>
      this.compareRows(left, right),
    );
  }

  get hasNoMatches() {
    return this.filteredRows.length === 0;
  }

  get hasUserFilters() {
    return (
      this.selectedValueTier !== 'all' ||
      this.selectedFamilyIds.length > 0 ||
      this.selectedRegionIds.length > 0 ||
      this.selectedTermId !== 'monthly' ||
      this.sortId !== 'effective-monthly' ||
      !this.stockOnly
    );
  }

  get metrics() {
    const lowestPrice = this.filteredRows.reduce(
      (lowest, row) => Math.min(lowest, row.effectiveMonthlyUsd),
      Number.POSITIVE_INFINITY,
    );
    const bestValueTier =
      this.filteredRows.reduce((best, row) => {
        const current = valueTierOrder[row.valueTier];
        const existing = best === null ? 3 : valueTierOrder[best];

        if (current < existing) {
          return row.valueTier;
        }

        return best;
      }, null as CatalogValueTier | null) ?? 'Performance';

    return [
      { label: 'Rows', value: String(this.filteredRows.length) },
      {
        label: 'Lowest',
        value: lowestPrice === Number.POSITIVE_INFINITY ? '$0' : `$${lowestPrice}`,
      },
      { label: 'Best value tier', value: bestValueTier },
      { label: 'Status', value: this.book.status },
    ];
  }
  get regionOptions(): readonly FilterOption[] {
    const byId = new Map(this.rows.map((row) => [row.region.regionId, row.region.regionLabel]));

    return [...byId.entries()]
      .sort((left, right) => left[1].localeCompare(right[1]))
      .map(([id, label]) => ({ id, label }));
  }

  get relatedBooks() {
    return this.priceBooks
      .filter((book) => book.id !== this.book.id)
      .map((book) => ({ ...book, href: `/pricing/${book.id}` }));
  }

  get rows(): readonly PriceBookRow[] {
    return this.products.flatMap((plan) =>
      plan.availabilityByRegion.map((region) => this.toPriceBookRow(plan, region)),
    );
  }

  get sortOptions() {
    return sortOptions;
  }

  resetFilters() {
    this.selectedFamilyIds = [];
    this.selectedRegionIds = [];
    this.selectedTermId = 'monthly';
    this.sortId = 'effective-monthly';
    this.selectedValueTier = 'all';
    this.stockOnly = true;
  }

  setMinValueTier(value: string) {
    this.selectedValueTier = value;
  }

  setPriceBookId(priceBookId: string | undefined) {
    this.priceBookId = priceBookId;
  }

  setSort(sortId: string) {
    this.sortId = this.isSortId(sortId) ? sortId : 'effective-monthly';
  }

  setStockOnly(value: boolean) {
    this.stockOnly = value;
  }

  setTerm(termId: BillingTermId) {
    this.selectedTermId = termId;
  }

  toggleFamily(familyId: string) {
    this.selectedFamilyIds = this.toggleValue(this.selectedFamilyIds, familyId);
  }

  toggleRegion(regionId: string) {
    this.selectedRegionIds = this.toggleValue(this.selectedRegionIds, regionId);
  }

  private compareRows(left: PriceBookRow, right: PriceBookRow) {
    if (this.sortId === 'most-value') {
      return valueTierOrder[left.valueTier] - valueTierOrder[right.valueTier];
    }

    if (this.sortId === 'yearly-savings') {
      return right.yearlySavingsUsd - left.yearlySavingsUsd;
    }

    if (this.sortId === 'stock') {
      return right.region.stock - left.region.stock;
    }

    if (this.sortId === 'source-revision') {
      return right.sourceRevision - left.sourceRevision;
    }

    if (this.sortId === 'recently-updated') {
      return Date.parse(right.plan.system.updatedAt) - Date.parse(left.plan.system.updatedAt);
    }

    return left.effectiveMonthlyUsd - right.effectiveMonthlyUsd;
  }
  private isSortId(value: string): value is PriceBookSortId {
    return sortOptions.some((option) => option.id === value);
  }

  private get priceBooks() {
    return this.dataSource.getPriceBooks();
  }

  private get products() {
    return this.dataSource.getProducts();
  }

  private matchesRow(row: PriceBookRow) {
    const matchesFamily =
      this.selectedFamilyIds.length === 0 || this.selectedFamilyIds.includes(row.family);
    const matchesRegion =
      this.selectedRegionIds.length === 0 || this.selectedRegionIds.includes(row.region.regionId);
    const matchesStock = !this.stockOnly || row.region.stock > 0;
    const matchesTier =
      this.selectedValueTier === 'all'
        ? true
        : valueTierOrder[row.valueTier] <= Number(this.selectedValueTier);

    return matchesFamily && matchesRegion && matchesStock && matchesTier;
  }

  private toPriceBookRow(plan: CatalogProduct, region: CatalogRegionAvailability): PriceBookRow {
    const baseMonthly =
      this.selectedTermId === 'yearly' ? plan.pricing.yearlyMonthlyUsd : plan.pricing.monthlyUsd;
    const effectiveMonthlyUsd = Math.round(baseMonthly * this.book.termMultiplier);
    const computed = calculateCatalogPlanValues(plan);

    return {
      effectiveMonthlyUsd,
      family: plan.family,
      id: `${this.book.id}:${plan.id}:${region.regionId}`,
      locationHref: `/locations/${region.regionId}`,
      plan,
      pricePerCore: computed.pricePerCore,
      pricePerGbRam: computed.pricePerGbRam,
      quoteHref: `/quote?plan=${plan.id}&region=${region.regionId}&term=${this.selectedTermId}`,
      region,
      rowHref: `/catalog/${plan.id}`,
      sourceRevision: plan.system.revision,
      topRegions: computed.topRegions,
      updatedAtDisplay: plan.system.updatedAt.slice(0, 10),
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
