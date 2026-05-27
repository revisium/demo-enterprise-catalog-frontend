import { makeAutoObservable } from 'mobx';

import {
  calculatePriceEfficiencyScore,
  type CatalogProduct,
  type CatalogRegionAvailability,
} from 'src/entities/catalog';
import type { PriceBook } from 'src/entities/pricing';
import { PricingDetailPageDataSource } from '../api/PricingDetailPageDataSource';

type BillingTermId = 'monthly' | 'yearly';
type PriceBookSortId =
  | 'effective-monthly'
  | 'price-efficiency'
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
  readonly priceEfficiencyScore: number;
  readonly quoteHref: string;
  readonly region: CatalogRegionAvailability;
  readonly rowHref: string;
  readonly sourceRevision: number;
  readonly updatedAtDisplay: string;
  readonly yearlySavingsUsd: number;
}

const efficiencyOptions: readonly FilterOption[] = [
  { id: '0', label: 'Any score' },
  { id: '100', label: '100+' },
  { id: '150', label: '150+' },
  { id: '200', label: '200+' },
  { id: '250', label: '250+' },
];

const sortOptions: readonly FilterOption[] = [
  { id: 'effective-monthly', label: 'Lowest effective price' },
  { id: 'price-efficiency', label: 'Best efficiency score' },
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
  minEfficiency = 0;
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

  get efficiencyOptions() {
    return efficiencyOptions;
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
      this.minEfficiency > 0 ||
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
    const bestEfficiency = this.filteredRows.reduce(
      (highest, row) => Math.max(highest, row.priceEfficiencyScore),
      0,
    );

    return [
      { label: 'Rows', value: String(this.filteredRows.length) },
      {
        label: 'Lowest',
        value: lowestPrice === Number.POSITIVE_INFINITY ? '$0' : `$${lowestPrice}`,
      },
      { label: 'Best score', value: String(bestEfficiency) },
      { label: 'Status', value: this.book.status },
    ];
  }

  get queryRows() {
    return [
      {
        label: 'Families',
        value: this.getSelectedOptionLabels(this.familyOptions, this.selectedFamilyIds, 'any'),
      },
      {
        label: 'Regions',
        value: this.getSelectedOptionLabels(this.regionOptions, this.selectedRegionIds, 'any'),
      },
      {
        label: 'Term',
        value: this.selectedTermId === 'yearly' ? 'yearly monthly rate' : 'monthly rate',
      },
      {
        label: 'Efficiency score',
        value: this.minEfficiency === 0 ? 'any score' : `${this.minEfficiency}+`,
      },
      { label: 'Sort', value: this.getOptionLabel(sortOptions, this.sortId) },
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
    this.minEfficiency = 0;
    this.stockOnly = true;
  }

  setMinEfficiency(value: string) {
    const parsed = Number(value);
    this.minEfficiency = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
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
    if (this.sortId === 'price-efficiency') {
      return right.priceEfficiencyScore - left.priceEfficiencyScore;
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

  private getOptionLabel(options: readonly FilterOption[], id: string) {
    return options.find((option) => option.id === id)?.label ?? id;
  }

  private getSelectedOptionLabels(
    options: readonly FilterOption[],
    selectedIds: readonly string[],
    emptyLabel: string,
  ) {
    if (selectedIds.length === 0) {
      return emptyLabel;
    }

    return selectedIds.map((id) => this.getOptionLabel(options, id)).join(', ');
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
    const matchesEfficiency = row.priceEfficiencyScore >= this.minEfficiency;
    const matchesStock = !this.stockOnly || row.region.stock > 0;

    return matchesFamily && matchesRegion && matchesEfficiency && matchesStock;
  }

  private toPriceBookRow(plan: CatalogProduct, region: CatalogRegionAvailability): PriceBookRow {
    const baseMonthly =
      this.selectedTermId === 'yearly' ? plan.pricing.yearlyMonthlyUsd : plan.pricing.monthlyUsd;
    const effectiveMonthlyUsd = Math.round(baseMonthly * this.book.termMultiplier);

    return {
      effectiveMonthlyUsd,
      family: plan.family,
      id: `${this.book.id}:${plan.id}:${region.regionId}`,
      locationHref: `/locations/${region.regionId}`,
      plan,
      priceEfficiencyScore: calculatePriceEfficiencyScore(plan),
      quoteHref: `/quote?plan=${plan.id}&region=${region.regionId}&term=${this.selectedTermId}`,
      region,
      rowHref: `/catalog/${plan.id}`,
      sourceRevision: plan.system.revision,
      updatedAtDisplay: plan.system.updatedAt.slice(0, 10),
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
