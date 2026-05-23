import { makeAutoObservable } from 'mobx';

import type { CatalogProduct } from 'src/entities/catalog';
import { LocationsPageDataSource } from '../api/LocationsPageDataSource';

type LocationSortId = 'fastest-setup' | 'most-plans' | 'recently-updated' | 'region-name' | 'stock';
type SupportWindowId = '24-7' | 'all' | 'business-hours';

interface FilterOption {
  readonly id: string;
  readonly label: string;
}

interface LocationPlanRow {
  readonly dataCenterCode: string;
  readonly plan: CatalogProduct;
  readonly setupHours: number;
  readonly stock: number;
  readonly supportWindow: string;
}

interface LocationRow {
  readonly dataCenterCodes: readonly string[];
  readonly fastestSetupHours: number;
  readonly families: readonly string[];
  readonly latestUpdatedAt: string;
  readonly plans: readonly LocationPlanRow[];
  readonly regionId: string;
  readonly regionLabel: string;
  readonly supportWindows: readonly string[];
  readonly totalStock: number;
}

const sortOptions: readonly FilterOption[] = [
  { id: 'stock', label: 'Most stock' },
  { id: 'fastest-setup', label: 'Fastest setup' },
  { id: 'most-plans', label: 'Most server plans' },
  { id: 'recently-updated', label: 'Recently updated' },
  { id: 'region-name', label: 'Region name' },
];

const stockOptions: readonly FilterOption[] = [
  { id: '0', label: 'Any stock' },
  { id: '5', label: '5+ units' },
  { id: '20', label: '20+ units' },
  { id: '50', label: '50+ units' },
];

const supportOptions: readonly FilterOption[] = [
  { id: 'all', label: 'Any support' },
  { id: '24-7', label: '24/7 support' },
  { id: 'business-hours', label: 'Business hours' },
];

export class LocationsPageViewModel {
  private readonly dataSource = new LocationsPageDataSource();

  minStock = 0;
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
          plan,
          setupHours: availability.setupHours,
          stock: availability.stock,
          supportWindow: availability.supportWindow,
        });
        byRegion.set(availability.regionId, rows);
      });
    });

    return [...byRegion.entries()].map(([regionId, plans]) => {
      const updatedTimes = plans.map((row) => Date.parse(row.plan.system.updatedAt));

      return {
        dataCenterCodes: [...new Set(plans.map((row) => row.dataCenterCode))].sort((left, right) =>
          left.localeCompare(right),
        ),
        fastestSetupHours: Math.min(...plans.map((row) => row.setupHours)),
        families: [...new Set(plans.map((row) => row.plan.family))].sort((left, right) =>
          left.localeCompare(right),
        ),
        latestUpdatedAt: new Date(Math.max(...updatedTimes)).toISOString(),
        plans,
        regionId,
        regionLabel: regionLabels.get(regionId) ?? regionId,
        supportWindows: [...new Set(plans.map((row) => row.supportWindow))].sort((left, right) =>
          left.localeCompare(right),
        ),
        totalStock: plans.reduce((total, row) => total + row.stock, 0),
      };
    });
  }

  get filteredLocations(): readonly LocationRow[] {
    return [...this.locations.filter((location) => this.matchesLocation(location))].sort(
      (left, right) => this.compareLocations(left, right),
    );
  }

  get families(): readonly FilterOption[] {
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

  get supportOptions() {
    return supportOptions;
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
    ];
  }

  formatUpdatedDate(value: string) {
    return new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'short',
    }).format(new Date(value));
  }

  setMinStock(value: string) {
    this.minStock = Number(value);
  }

  setSort(sortId: string) {
    this.sortId = this.isSortId(sortId) ? sortId : 'stock';
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

  private isSupportWindowId(value: string): value is SupportWindowId {
    return supportOptions.some((option) => option.id === value);
  }

  private matchesLocation(location: LocationRow) {
    const matchesFamily =
      this.selectedFamilyIds.length === 0 ||
      location.plans.some((row) => this.selectedFamilyIds.includes(row.plan.family));
    const matchesStock = this.minStock === 0 || location.totalStock >= this.minStock;
    const matchesSupport =
      this.selectedSupportWindowId === 'all' ||
      location.supportWindows.some(
        (window) => this.normalizeSupportWindow(window) === this.selectedSupportWindowId,
      );

    return matchesFamily && matchesStock && matchesSupport;
  }

  private normalizeSupportWindow(value: string) {
    return value === '24/7' ? '24-7' : 'business-hours';
  }

  private toggleValue(values: readonly string[], value: string) {
    if (values.includes(value)) {
      return values.filter((item) => item !== value);
    }

    return [...values, value];
  }
}
