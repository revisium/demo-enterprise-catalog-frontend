import { makeAutoObservable } from 'mobx';

import {
  calculateCatalogReadinessScore,
  calculatePriceEfficiencyScore,
  createStockFilterOptions,
  getFastestSetupHours,
  normalizeSupportWindowId,
  supportWindowFilterOptions,
  type CatalogFilterOption,
  type CatalogProduct,
  type CatalogRegionSummaryFields,
} from 'src/entities/catalog';
import { LocationDetailPageDataSource } from '../api/LocationDetailPageDataSource';

type LocationPlanSortId =
  | 'display-order'
  | 'fastest-setup'
  | 'monthly-price'
  | 'price-efficiency'
  | 'recently-updated'
  | 'stock';
type SupportWindowId = '24-7' | 'all' | 'business-hours';

interface LocationPlanRow {
  readonly dataCenterCode: string;
  readonly displayUpdatedDate: string;
  readonly effectiveMonthlyPrice: number;
  readonly plan: CatalogProduct;
  readonly planHref: string;
  readonly priceEfficiencyScore: number;
  readonly setupHours: number;
  readonly stock: number;
  readonly supportWindow: string;
}

interface RegionSummaryRow extends CatalogRegionSummaryFields {
  readonly href: string;
  readonly planCount: number;
}

const sortOptions: readonly CatalogFilterOption[] = [
  { id: 'price-efficiency', label: 'Best price efficiency' },
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
  sortId: LocationPlanSortId = 'price-efficiency';

  constructor(private readonly routeRegionId: string | undefined) {
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
        readinessScore: 0,
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

        if (right.readinessScore !== left.readinessScore) {
          return right.readinessScore - left.readinessScore;
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

  get summaryMetrics() {
    return [
      { label: 'Plans', value: String(this.regionSummary.planCount) },
      { label: 'Total stock', value: String(this.regionSummary.totalStock) },
      { label: 'Readiness', value: String(this.regionSummary.readinessScore) },
      { label: 'Fastest setup', value: `${this.regionSummary.fastestSetupHours}h` },
    ];
  }

  get queryRows() {
    return [
      {
        label: 'Region',
        value: this.regionSummary.regionLabel,
      },
      {
        label: 'Filters',
        value: this.getActiveFilterLabels().join(', ') || 'none',
      },
      {
        label: 'Plan sort',
        value: this.sortId === 'price-efficiency' ? 'price efficiency' : 'not selected',
      },
      {
        label: 'Catalog sort',
        value:
          this.sortId === 'display-order' || this.sortId === 'recently-updated' ? 'active' : 'none',
      },
    ];
  }

  formatSupportWindow(value: string) {
    return value === '24/7' ? '24/7' : 'Business hours';
  }

  resetFilters() {
    this.minStock = 0;
    this.selectedFamilyIds = [];
    this.selectedSupportWindowId = 'all';
    this.sortId = 'price-efficiency';
  }

  setMinStock(value: string) {
    this.minStock = this.parseNonNegativeNumber(value);
  }

  setSort(sortId: string) {
    this.sortId = this.isSortId(sortId) ? sortId : 'price-efficiency';
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
          priceEfficiencyScore: calculatePriceEfficiencyScore(plan),
          setupHours: availability.setupHours,
          stock: availability.stock,
          supportWindow: availability.supportWindow,
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
    const fastestSetupHours = getFastestSetupHours(rows.map((row) => row.setupHours));
    const totalStock = rows.reduce((total, row) => total + row.stock, 0);

    return {
      dataCenterCodes: this.getUniqueSorted(rows.map((row) => row.dataCenterCode)),
      enterpriseCoveragePercent,
      families,
      familyCoveragePercent,
      fastestSetupHours,
      href: `/locations/${regionId}`,
      planCount: rows.length,
      readinessScore: calculateCatalogReadinessScore({
        enterpriseCoveragePercent,
        familyCoveragePercent,
        fastestSetupHours,
        totalStock,
      }),
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

    return right.priceEfficiencyScore - left.priceEfficiencyScore;
  }

  private getActiveFilterLabels() {
    return [
      this.selectedFamilyIds.length > 0 ? 'family' : undefined,
      this.minStock > 0 ? 'stock' : undefined,
      this.selectedSupportWindowId === 'all' ? undefined : 'support window',
    ].filter((label): label is string => typeof label === 'string');
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
}
