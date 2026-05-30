import { makeAutoObservable } from 'mobx';

import {
  calculateCatalogPlanValues,
  createStockFilterOptions,
  valueTierOrder,
  normalizeSupportWindowId,
  supportWindowFilterOptions,
  type CatalogFilterOption,
  type CatalogProduct,
  type CatalogRegionSummaryFields,
  type CatalogValueTier,
} from 'src/entities/catalog';
import { LocationsPageDataSource } from '../api/LocationsPageDataSource';

type LocationSortId =
  | 'fastest-setup'
  | 'most-plans'
  | 'most-value'
  | 'recently-updated'
  | 'region-name'
  | 'stock';
type ValueTierFilterId = 'all' | 'economy' | 'balanced' | 'performance';
type SupportWindowId = '24-7' | 'all' | 'business-hours';

interface LocationPlanRow {
  readonly dataCenterCode: string;
  readonly effectiveMonthlyPrice: number;
  readonly planHref: string;
  readonly plan: CatalogProduct;
  readonly setupHours: number;
  readonly stock: number;
  readonly supportWindow: string;
  readonly valueTier: CatalogValueTier;
}

interface LocationRow extends CatalogRegionSummaryFields {
  readonly bestValueTier: CatalogValueTier;
  readonly latestUpdatedAt: string;
  readonly plans: readonly LocationPlanRow[];
}

const sortOptions: readonly CatalogFilterOption[] = [
  { id: 'stock', label: 'Most stock' },
  { id: 'most-value', label: 'Best value tier' },
  { id: 'fastest-setup', label: 'Fastest setup' },
  { id: 'most-plans', label: 'Most server plans' },
  { id: 'recently-updated', label: 'Recently updated' },
  { id: 'region-name', label: 'Region name' },
];

const valueTierOptions: readonly CatalogFilterOption[] = [
  { id: 'all', label: 'Any tier' },
  { id: 'economy', label: 'Economy and up' },
  { id: 'balanced', label: 'Balanced and up' },
  { id: 'performance', label: 'Performance only' },
];

const stockOptions = createStockFilterOptions([5, 20, 50]);
const supportOptions = supportWindowFilterOptions;

const valueTierOrderById: Record<ValueTierFilterId, number | null> = {
  all: null,
  economy: 0,
  balanced: 1,
  performance: 2,
};

export class LocationsPageViewModel {
  private readonly dataSource = new LocationsPageDataSource();

  minStock = 0;
  selectedValueTierId: ValueTierFilterId = 'all';
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
        const computed = calculateCatalogPlanValues(plan);
        regionLabels.set(availability.regionId, availability.regionLabel);

        const rows = byRegion.get(availability.regionId) ?? [];
        rows.push({
          dataCenterCode: availability.dataCenterCode,
          effectiveMonthlyPrice: plan.pricing.monthlyUsd,
          planHref: `/catalog/${plan.id}`,
          plan,
          setupHours: availability.setupHours,
          stock: availability.stock,
          supportWindow: availability.supportWindow,
          valueTier: computed.valueTier,
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
      const enterpriseCoveragePercent = plans.length > 0 ? Math.round((enterpriseRows / plans.length) * 100) : 0;
      const bestValueTier = plans.reduce<CatalogValueTier>(
        (best, row) => (valueTierOrder[row.valueTier] < valueTierOrder[best] ? row.valueTier : best),
        'Performance',
      );

      return {
        bestValueTier,
        dataCenterCodes: [...new Set(plans.map((row) => row.dataCenterCode))].sort((left, right) =>
          left.localeCompare(right),
        ),
        enterpriseCoveragePercent,
        families,
        familyCoveragePercent,
        fastestSetupHours: Number.isFinite(fastestSetupHours) ? fastestSetupHours : 0,
        latestUpdatedAt: new Date(Math.max(...updatedTimes)).toISOString(),
        plans,
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

  get featuredLocation(): LocationRow | undefined {
    return [...this.filteredLocations].sort((left, right) => {
      if (right.bestValueTier !== left.bestValueTier) {
        return valueTierOrder[left.bestValueTier] - valueTierOrder[right.bestValueTier];
      }

      if (right.totalStock !== left.totalStock) {
        return right.totalStock - left.totalStock;
      }

      return left.fastestSetupHours - right.fastestSetupHours;
    })[0];
  }

  get filteredTotalStock() {
    return this.filteredLocations.reduce((total, location) => total + location.totalStock, 0);
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

  get valueTierOptions() {
    return valueTierOptions;
  }

  get supportOptions() {
    return supportOptions;
  }

  get hasNoMatches() {
    return this.filteredLocations.length === 0;
  }

  get hasUserFilters() {
    return (
      this.minStock > 0 ||
      this.selectedFamilyIds.length > 0 ||
      this.selectedValueTierId !== 'all' ||
      this.selectedSupportWindowId !== 'all' ||
      this.sortId !== 'stock'
    );
  }

  get summaryMetrics() {
    const bestValueTier =
      this.filteredLocations.length === 0
        ? 'Performance'
        : this.filteredLocations.reduce<CatalogValueTier>((best, location) => {
            const order = valueTierOrder[location.bestValueTier];
            const bestOrder = valueTierOrder[best];

            if (order < bestOrder) {
              return location.bestValueTier;
            }

            return best;
          }, 'Performance');

    return [
      { label: 'Regions', value: String(this.filteredLocations.length) },
      {
        label: 'Total stock',
        value: String(this.filteredTotalStock),
      },
      {
        label: 'Plan rows',
        value: String(
          this.filteredLocations.reduce((total, location) => total + location.plans.length, 0),
        ),
      },
      {
        label: 'Best value tier',
        value: bestValueTier,
      },
    ];
  }

  formatUpdatedDate(value: string) {
    return new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'short',
    }).format(new Date(value));
  }

  formatSupportWindow(value: string) {
    const normalized = normalizeSupportWindowId(value);

    if (normalized === '24-7') {
      return '24/7 support';
    }

    if (normalized === 'business-hours') {
      return 'Business hours';
    }

    return value;
  }

  setMinStock(value: string) {
    this.minStock = this.parseNonNegativeNumber(value);
  }

  resetFilters() {
    this.minStock = 0;
    this.selectedValueTierId = 'all';
    this.selectedFamilyIds = [];
    this.selectedSupportWindowId = 'all';
    this.sortId = 'stock';
  }

  setSort(sortId: string) {
    this.sortId = this.isSortId(sortId) ? sortId : 'stock';
  }

  setValueTier(value: string) {
    this.selectedValueTierId = this.isValueTierFilterId(value) ? value : 'all';
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

    if (this.sortId === 'most-value') {
      if (right.bestValueTier !== left.bestValueTier) {
        return valueTierOrder[left.bestValueTier] - valueTierOrder[right.bestValueTier];
      }
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

  private isValueTierFilterId(value: string): value is ValueTierFilterId {
    return valueTierOptions.some((option) => option.id === value);
  }

  private isSupportWindowId(value: string): value is SupportWindowId {
    return supportOptions.some((option) => option.id === value);
  }

  private matchesLocation(location: LocationRow) {
    const matchesFamily =
      this.selectedFamilyIds.length === 0 ||
      location.plans.some((row) => this.selectedFamilyIds.includes(row.plan.family));
    const matchesStock = this.minStock === 0 || location.totalStock >= this.minStock;
    const minTier = valueTierOrderById[this.selectedValueTierId];
    const matchesValueTier =
      this.selectedValueTierId === 'all' ? true : minTier !== null && valueTierOrder[location.bestValueTier] >= minTier;
    const matchesSupport =
      this.selectedSupportWindowId === 'all' ||
      location.supportWindows.some(
        (window) => normalizeSupportWindowId(window) === this.selectedSupportWindowId,
      );

    return matchesFamily && matchesStock && matchesValueTier && matchesSupport;
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
