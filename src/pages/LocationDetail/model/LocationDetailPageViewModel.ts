import { makeAutoObservable } from 'mobx';

import {
  createStockFilterOptions,
  calculateCatalogPlanValues,
  normalizeSupportWindowId,
  supportWindowFilterOptions,
  valueTierOrder,
  type CatalogFilterOption,
  type CatalogProduct,
  type CatalogRegionSummaryFields,
  type CatalogValueTier,
} from 'src/entities/catalog';
import { LocationDetailPageDataSource } from '../api/LocationDetailPageDataSource';

type LocationPlanSortId =
  | 'display-order'
  | 'fastest-setup'
  | 'most-value'
  | 'monthly-price'
  | 'recently-updated'
  | 'stock';
type SupportWindowId = '24-7' | 'all' | 'business-hours';

interface LocationPlanRow {
  readonly dataCenterCode: string;
  readonly displayUpdatedDate: string;
  readonly effectiveMonthlyPrice: number;
  readonly plan: CatalogProduct;
  readonly planHref: string;
  readonly pricePerCore: number | null;
  readonly pricePerGbRam: number | null;
  readonly quoteHref: string;
  readonly setupHours: number;
  readonly topRegions: readonly string[];
  readonly stock: number;
  readonly supportWindow: string;
  readonly valueTier: CatalogValueTier;
}

interface RegionSummaryRow extends CatalogRegionSummaryFields {
  readonly href: string;
  readonly planCount: number;
}

const sortOptions: readonly CatalogFilterOption[] = [
  { id: 'most-value', label: 'Best value tier' },
  { id: 'stock', label: 'Most stock' },
  { id: 'fastest-setup', label: 'Fastest setup' },
  { id: 'monthly-price', label: 'Lowest monthly price' },
  { id: 'recently-updated', label: 'Recently updated' },
  { id: 'display-order', label: 'Catalog order' },
];

const stockOptions = createStockFilterOptions([2, 5, 20]);
const supportOptions = supportWindowFilterOptions;

export class LocationDetailPageViewModel {
  private readonly dataSource = new LocationDetailPageDataSource();

  minStock = 0;
  selectedFamilyIds: readonly string[] = [];
  selectedSupportWindowId: SupportWindowId = 'all';
  sortId: LocationPlanSortId = 'most-value';
  routeRegionId: string | undefined;

  constructor(routeRegionId: string | undefined) {
    this.routeRegionId = routeRegionId;
    makeAutoObservable(this);
  }

  get products() {
    return this.dataSource.getProducts();
  }

  get regionId() {
    const requestedRegionId = this.routeRegionId;

    if (
      requestedRegionId &&
      this.regionSummaries.some((region) => region.regionId === requestedRegionId)
    ) {
      return requestedRegionId;
    }

    return this.regionSummaries[0]?.regionId ?? '';
  }

  get regionSummary(): RegionSummaryRow {
    const summary = this.regionSummaries.find((region) => region.regionId === this.regionId);

    if (!summary) {
      return {
        dataCenterCodes: [],
        enterpriseCoveragePercent: 0,
        families: [],
        familyCoveragePercent: 0,
        fastestSetupHours: 0,
        href: '/locations',
        planCount: 0,
        bestValueTier: 'Performance',
        regionId: this.regionId,
        regionLabel: 'Unknown region',
        supportWindows: [],
        totalStock: 0,
      };
    }

    return summary;
  }

  get regionPlanRows(): readonly LocationPlanRow[] {
    return this.buildPlanRows(this.regionId);
  }

  get filteredPlanRows(): readonly LocationPlanRow[] {
    return [...this.regionPlanRows.filter((row) => this.matchesPlanRow(row))].sort((left, right) =>
      this.comparePlanRows(left, right),
    );
  }

  get featuredPlanRow(): LocationPlanRow | undefined {
    return [...this.filteredPlanRows].sort((left, right) => {
      if (right.valueTier !== left.valueTier) {
        return valueTierOrder[left.valueTier] - valueTierOrder[right.valueTier];
      }

      if (right.stock !== left.stock) {
        return right.stock - left.stock;
      }

      return left.setupHours - right.setupHours;
    })[0];
  }

  get relatedRegions() {
    const selectedFamilies = new Set(this.regionSummary.families);

    return this.regionSummaries
      .filter((region) => region.regionId !== this.regionId)
      .map((region) => ({
        ...region,
        matchingFamilyCount: region.families.filter((family) => selectedFamilies.has(family))
          .length,
      }))
      .sort((left, right) => {
        if (right.matchingFamilyCount !== left.matchingFamilyCount) {
          return right.matchingFamilyCount - left.matchingFamilyCount;
        }

        if (right.bestValueTier !== left.bestValueTier) {
          return valueTierOrder[left.bestValueTier] - valueTierOrder[right.bestValueTier];
        }

        return right.totalStock - left.totalStock;
      })
      .slice(0, 3);
  }

  get familyOptions(): readonly CatalogFilterOption[] {
    return this.regionSummary.families.map((family) => ({ id: family, label: family }));
  }

  get sortOptions() {
    return sortOptions;
  }

  get stockOptions() {
    return stockOptions;
  }

  get supportOptions() {
    return supportOptions;
  }

  get hasNoMatches() {
    return this.filteredPlanRows.length === 0;
  }

  get hasUserFilters() {
    return (
      this.minStock > 0 ||
      this.selectedFamilyIds.length > 0 ||
      this.selectedSupportWindowId !== 'all' ||
      this.sortId !== 'most-value'
    );
  }

  get summaryMetrics() {
    return [
      { label: 'Plans', value: String(this.regionSummary.planCount) },
      { label: 'Total stock', value: String(this.regionSummary.totalStock) },
      { label: 'Best value tier', value: String(this.regionSummary.bestValueTier) },
      { label: 'Fastest setup', value: `${this.regionSummary.fastestSetupHours}h` },
    ];
  }
  formatSupportWindow(value: string) {
    const normalized = normalizeSupportWindowId(value);

    if (normalized === '24-7') {
      return '24/7';
    }

    if (normalized === 'business-hours') {
      return 'Business hours';
    }

    return value;
  }

  resetFilters() {
    this.minStock = 0;
    this.selectedFamilyIds = [];
    this.selectedSupportWindowId = 'all';
    this.sortId = 'most-value';
  }

  setMinStock(value: string) {
    this.minStock = this.parseNonNegativeNumber(value);
  }

  setRouteRegionId(regionId: string | undefined) {
    if (this.routeRegionId === regionId) {
      return;
    }

    this.routeRegionId = regionId;
    this.resetFilters();
  }

  setSort(sortId: string) {
    this.sortId = this.isSortId(sortId) ? sortId : 'most-value';
  }

  setSupportWindow(value: string) {
    this.selectedSupportWindowId = this.isSupportWindowId(value) ? value : 'all';
  }

  toggleFamily(familyId: string) {
    this.selectedFamilyIds = this.toggleValue(this.selectedFamilyIds, familyId);
  }

  private get regionSummaries(): readonly RegionSummaryRow[] {
    const regionIds = [
      ...new Set(
        this.products.flatMap((product) =>
          product.availabilityByRegion.map((availability) => availability.regionId),
        ),
      ),
    ];

    return regionIds.map((regionId) => this.buildRegionSummary(regionId));
  }

  private buildPlanRows(regionId: string): readonly LocationPlanRow[] {
    return this.products.flatMap((plan) =>
      plan.availabilityByRegion
        .filter((availability) => availability.regionId === regionId)
        .map((availability) => ({
          dataCenterCode: availability.dataCenterCode,
          displayUpdatedDate: new Intl.DateTimeFormat('en', {
            day: 'numeric',
            month: 'short',
          }).format(new Date(plan.system.updatedAt)),
          effectiveMonthlyPrice: plan.pricing.monthlyUsd,
          plan,
          planHref: `/catalog/${plan.id}`,
          pricePerCore: calculateCatalogPlanValues(plan).pricePerCore,
          pricePerGbRam: calculateCatalogPlanValues(plan).pricePerGbRam,
          quoteHref: `/quote?plan=${plan.id}&region=${availability.regionId}`,
          setupHours: availability.setupHours,
          topRegions: calculateCatalogPlanValues(plan).topRegions,
          stock: availability.stock,
          supportWindow: availability.supportWindow,
          valueTier: calculateCatalogPlanValues(plan).valueTier,
        })),
    );
  }

  private buildRegionSummary(regionId: string): RegionSummaryRow {
    const rows = this.buildPlanRows(regionId);
    const families = this.getUniqueSorted(rows.map((row) => row.plan.family));
    const regionLabel = rows[0]?.plan.availabilityByRegion.find(
      (availability) => availability.regionId === regionId,
    )?.regionLabel;
    const totalFamilies = this.getUniqueSorted(this.products.map((product) => product.family));
    const familyCoveragePercent =
      totalFamilies.length > 0 ? Math.round((families.length / totalFamilies.length) * 100) : 0;
    const enterpriseRows = rows.filter((row) => row.plan.supportTier === 'Enterprise').length;
    const enterpriseCoveragePercent =
      rows.length > 0 ? Math.round((enterpriseRows / rows.length) * 100) : 0;
    const fastestSetupHours = rows.reduce(
      (fastest, row) => Math.min(fastest, row.setupHours),
      Number.POSITIVE_INFINITY,
    );
    const totalStock = rows.reduce((total, row) => total + row.stock, 0);
    const bestValueTier = rows.reduce<CatalogValueTier>(
      (best, row) => (valueTierOrder[row.valueTier] < valueTierOrder[best] ? row.valueTier : best),
      'Performance',
    );

    return {
      dataCenterCodes: this.getUniqueSorted(rows.map((row) => row.dataCenterCode)),
      enterpriseCoveragePercent,
      families,
      familyCoveragePercent,
      fastestSetupHours: Number.isFinite(fastestSetupHours) ? fastestSetupHours : 0,
      href: `/locations/${regionId}`,
      planCount: rows.length,
      bestValueTier,
      regionId,
      regionLabel: regionLabel ?? regionId,
      supportWindows: this.getUniqueSorted(rows.map((row) => row.supportWindow)),
      totalStock,
    };
  }

  private comparePlanRows(left: LocationPlanRow, right: LocationPlanRow) {
    if (this.sortId === 'stock') {
      return right.stock - left.stock;
    }

    if (this.sortId === 'fastest-setup') {
      return left.setupHours - right.setupHours;
    }

    if (this.sortId === 'monthly-price') {
      return left.effectiveMonthlyPrice - right.effectiveMonthlyPrice;
    }

    if (this.sortId === 'recently-updated') {
      return Date.parse(right.plan.system.updatedAt) - Date.parse(left.plan.system.updatedAt);
    }

    if (this.sortId === 'display-order') {
      return left.plan.system.displayOrder - right.plan.system.displayOrder;
    }

    if (this.sortId === 'most-value') {
      return valueTierOrder[left.valueTier] - valueTierOrder[right.valueTier];
    }

    return right.plan.pricing.monthlyUsd - left.plan.pricing.monthlyUsd;
  }

  private getUniqueSorted(values: readonly string[]) {
    return [...new Set(values)].sort((left, right) => left.localeCompare(right));
  }
  private isSortId(value: string): value is LocationPlanSortId {
    return sortOptions.some((option) => option.id === value);
  }

  private isSupportWindowId(value: string): value is SupportWindowId {
    return supportOptions.some((option) => option.id === value);
  }

  private matchesPlanRow(row: LocationPlanRow) {
    const matchesFamily =
      this.selectedFamilyIds.length === 0 || this.selectedFamilyIds.includes(row.plan.family);
    const matchesStock = this.minStock === 0 || row.stock >= this.minStock;
    const matchesSupport =
      this.selectedSupportWindowId === 'all' ||
      normalizeSupportWindowId(row.supportWindow) === this.selectedSupportWindowId;

    return matchesFamily && matchesStock && matchesSupport;
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

  formatPricePerCore(value: number | null) {
    return value === null ? '—' : `$${value.toFixed(2)}/core`;
  }

  formatPricePerGbRam(value: number | null) {
    return value === null ? '—' : `$${value.toFixed(2)}/GB`;
  }
}
