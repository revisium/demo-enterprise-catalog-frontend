import { makeAutoObservable } from 'mobx';

import {
  calculateCatalogReadinessScore,
  calculatePriceEfficiencyScore,
  createStockFilterOptions,
  normalizeSupportWindowId,
  supportWindowFilterOptions,
  type CatalogFilterOption,
  type CatalogProduct,
  type CatalogRegionSummaryFields,
} from 'src/entities/catalog';
import { LocationsPageDataSource } from '../api/LocationsPageDataSource';

type LocationSortId =
  | 'fastest-setup'
  | 'most-plans'
  | 'readiness-score'
  | 'recently-updated'
  | 'region-name'
  | 'stock';
type ReadinessBandId = 'all' | 'high' | 'medium';
type SupportWindowId = '24-7' | 'all' | 'business-hours';

interface LocationPlanRow {
  readonly dataCenterCode: string;
  readonly effectiveMonthlyPrice: number;
  readonly planHref: string;
  readonly plan: CatalogProduct;
  readonly priceEfficiencyScore: number;
  readonly setupHours: number;
  readonly stock: number;
  readonly supportWindow: string;
}

interface LocationRow extends CatalogRegionSummaryFields {
  readonly latestUpdatedAt: string;
  readonly plans: readonly LocationPlanRow[];
}

const sortOptions: readonly CatalogFilterOption[] = [
  { id: 'stock', label: 'Most stock' },
  { id: 'readiness-score', label: 'Best readiness score' },
  { id: 'fastest-setup', label: 'Fastest setup' },
  { id: 'most-plans', label: 'Most server plans' },
  { id: 'recently-updated', label: 'Recently updated' },
  { id: 'region-name', label: 'Region name' },
];

const readinessOptions: readonly CatalogFilterOption[] = [
  { id: 'all', label: 'Any readiness' },
  { id: 'medium', label: '70+ score' },
  { id: 'high', label: '85+ score' },
];

const stockOptions = createStockFilterOptions([5, 20, 50]);
const supportOptions = supportWindowFilterOptions;

export class LocationsPageViewModel {
  private readonly dataSource = new LocationsPageDataSource();

  minStock = 0;
  selectedReadinessBandId: ReadinessBandId = 'all';
  selectedFamilyIds: readonly string[] = [];
  selectedSupportWindowId: SupportWindowId = 'all';
  sortId: LocationSortId = 'stock';

  constructor() {
    makeAutoObservable(this);
  }

  get products() {
    return this.dataSource.getProducts();
  }

  get locations(): readonly LocationRow[] {
    const byRegion = new Map<string, LocationPlanRow[]>();
    const regionLabels = new Map<string, string>();

    this.products.forEach((plan) => {
      plan.availabilityByRegion.forEach((availability) => {
        regionLabels.set(availability.regionId, availability.regionLabel);

        const rows = byRegion.get(availability.regionId) ?? [];
        rows.push({
          dataCenterCode: availability.dataCenterCode,
          effectiveMonthlyPrice: plan.pricing.monthlyUsd,
          planHref: `/catalog/${plan.id}`,
          plan,
          priceEfficiencyScore: calculatePriceEfficiencyScore(plan),
          setupHours: availability.setupHours,
          stock: availability.stock,
          supportWindow: availability.supportWindow,
        });
        byRegion.set(availability.regionId, rows);
      });
    });

    return [...byRegion.entries()].map(([regionId, plans]) => {
      const updatedTimes = plans.map((row) => Date.parse(row.plan.system.updatedAt));
      const fastestSetupHours = plans.reduce(
        (fastest, row) => Math.min(fastest, row.setupHours),
        Number.POSITIVE_INFINITY,
      );
      const families = [...new Set(plans.map((row) => row.plan.family))].sort((left, right) =>
        left.localeCompare(right),
      );
      const totalStock = plans.reduce((total, row) => total + row.stock, 0);
      const familyCount = this.families.length;
      const familyCoveragePercent =
        familyCount > 0 ? Math.round((families.length / familyCount) * 100) : 0;
      const enterpriseRows = plans.filter((row) => row.plan.supportTier === 'Enterprise').length;
      const enterpriseCoveragePercent =
        plans.length > 0 ? Math.round((enterpriseRows / plans.length) * 100) : 0;
      const readinessScore = calculateCatalogReadinessScore({
        enterpriseCoveragePercent,
        familyCoveragePercent,
        fastestSetupHours: Number.isFinite(fastestSetupHours) ? fastestSetupHours : 0,
        totalStock,
      });

      return {
        dataCenterCodes: [...new Set(plans.map((row) => row.dataCenterCode))].sort((left, right) =>
          left.localeCompare(right),
        ),
        enterpriseCoveragePercent,
        fastestSetupHours: Number.isFinite(fastestSetupHours) ? fastestSetupHours : 0,
        families,
        familyCoveragePercent,
        latestUpdatedAt: new Date(Math.max(...updatedTimes)).toISOString(),
        plans,
        readinessScore,
        regionId,
        regionLabel: regionLabels.get(regionId) ?? regionId,
        supportWindows: [...new Set(plans.map((row) => row.supportWindow))].sort((left, right) =>
          left.localeCompare(right),
        ),
        totalStock,
      };
    });
  }

  get filteredLocations(): readonly LocationRow[] {
    return [...this.locations.filter((location) => this.matchesLocation(location))].sort(
      (left, right) => this.compareLocations(left, right),
    );
  }

  get families(): readonly CatalogFilterOption[] {
    return [...new Set(this.products.map((product) => product.family))].map((family) => ({
      id: family,
      label: family,
    }));
  }

  get sortOptions() {
    return sortOptions;
  }

  get stockOptions() {
    return stockOptions;
  }

  get readinessOptions() {
    return readinessOptions;
  }

  get supportOptions() {
    return supportOptions;
  }

  get hasNoMatches() {
    return this.filteredLocations.length === 0;
  }

  get summaryMetrics() {
    return [
      { label: 'Regions', value: String(this.filteredLocations.length) },
      {
        label: 'Total stock',
        value: String(
          this.filteredLocations.reduce((total, location) => total + location.totalStock, 0),
        ),
      },
      {
        label: 'Plan rows',
        value: String(
          this.filteredLocations.reduce((total, location) => total + location.plans.length, 0),
        ),
      },
      {
        label: 'Best readiness',
        value: String(
          this.filteredLocations.reduce(
            (best, location) => Math.max(best, location.readinessScore),
            0,
          ),
        ),
      },
    ];
  }

  get queryRows() {
    return [
      {
        label: 'Computed filter',
        value:
          this.selectedReadinessBandId === 'all'
            ? 'not constrained'
            : `${this.getReadinessThreshold()}+ readiness`,
      },
      {
        label: 'Nested source',
        value: 'regional availability rows',
      },
      {
        label: 'Related plans',
        value: this.selectedFamilyIds.length > 0 ? 'family constrained' : 'all families',
      },
      {
        label: 'Computed sort',
        value: this.sortId === 'readiness-score' ? 'readiness score' : 'not selected',
      },
    ];
  }

  formatUpdatedDate(value: string) {
    return new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'short',
    }).format(new Date(value));
  }

  setMinStock(value: string) {
    this.minStock = this.parseNonNegativeNumber(value);
  }

  resetFilters() {
    this.minStock = 0;
    this.selectedReadinessBandId = 'all';
    this.selectedFamilyIds = [];
    this.selectedSupportWindowId = 'all';
    this.sortId = 'stock';
  }

  setSort(sortId: string) {
    this.sortId = this.isSortId(sortId) ? sortId : 'stock';
  }

  setReadinessBand(value: string) {
    this.selectedReadinessBandId = this.isReadinessBandId(value) ? value : 'all';
  }

  setSupportWindow(value: string) {
    this.selectedSupportWindowId = this.isSupportWindowId(value) ? value : 'all';
  }

  toggleFamily(familyId: string) {
    this.selectedFamilyIds = this.toggleValue(this.selectedFamilyIds, familyId);
  }

  private compareLocations(left: LocationRow, right: LocationRow) {
    if (this.sortId === 'fastest-setup') {
      return left.fastestSetupHours - right.fastestSetupHours;
    }

    if (this.sortId === 'readiness-score') {
      return right.readinessScore - left.readinessScore;
    }

    if (this.sortId === 'most-plans') {
      return right.plans.length - left.plans.length;
    }

    if (this.sortId === 'recently-updated') {
      return Date.parse(right.latestUpdatedAt) - Date.parse(left.latestUpdatedAt);
    }

    if (this.sortId === 'region-name') {
      return left.regionLabel.localeCompare(right.regionLabel);
    }

    return right.totalStock - left.totalStock;
  }

  private isSortId(value: string): value is LocationSortId {
    return sortOptions.some((option) => option.id === value);
  }

  private isReadinessBandId(value: string): value is ReadinessBandId {
    return readinessOptions.some((option) => option.id === value);
  }

  private isSupportWindowId(value: string): value is SupportWindowId {
    return supportOptions.some((option) => option.id === value);
  }

  private matchesLocation(location: LocationRow) {
    const matchesFamily =
      this.selectedFamilyIds.length === 0 ||
      location.plans.some((row) => this.selectedFamilyIds.includes(row.plan.family));
    const matchesStock = this.minStock === 0 || location.totalStock >= this.minStock;
    const matchesReadiness =
      this.selectedReadinessBandId === 'all' ||
      location.readinessScore >= this.getReadinessThreshold();
    const matchesSupport =
      this.selectedSupportWindowId === 'all' ||
      location.supportWindows.some(
        (window) => normalizeSupportWindowId(window) === this.selectedSupportWindowId,
      );

    return matchesFamily && matchesStock && matchesReadiness && matchesSupport;
  }

  private getReadinessThreshold() {
    if (this.selectedReadinessBandId === 'high') {
      return 85;
    }

    if (this.selectedReadinessBandId === 'medium') {
      return 70;
    }

    return 0;
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
