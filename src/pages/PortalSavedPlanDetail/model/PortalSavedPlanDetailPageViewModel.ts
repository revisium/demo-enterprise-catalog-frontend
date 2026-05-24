import { makeAutoObservable } from 'mobx';

import {
  catalogSnapshot,
  type CatalogProduct,
  type CatalogRegionAvailability,
} from 'src/entities/catalog';
import {
  portalOrganizations,
  portalQuotes,
  portalSavedPlans,
  type PortalSavedPlan,
} from 'src/entities/portal';

interface PackageRow {
  readonly label: string;
  readonly value: string;
}

export class PortalSavedPlanDetailPageViewModel {
  favoritedPlanIds: readonly string[] = ['plan-dedicated-r2-fra'];
  planId: string | undefined;
  readonly pricingPath = '/pricing';

  constructor(planId: string | undefined) {
    this.planId = planId;
    makeAutoObservable(this);
  }

  get isFavorited() {
    return this.favoritedPlanIds.includes(this.savedPlan.id);
  }

  get locationPath() {
    return this.region ? `/locations/${this.region.regionId}` : '/locations';
  }

  get metrics() {
    return [
      { label: 'Status', value: this.savedPlan.status },
      { label: 'Monthly', value: `$${this.savedPlan.monthlyUsd}` },
      { label: 'Region', value: this.savedPlan.region },
      { label: 'Quotes', value: String(this.relatedQuotes.length) },
    ];
  }

  get organization() {
    const organization =
      portalOrganizations.find((item) => item.id === this.savedPlan.organizationId) ??
      portalOrganizations[0];

    if (!organization) {
      throw new Error('Customer portal mock organizations are empty');
    }

    return organization;
  }

  get packageRows(): readonly PackageRow[] {
    return [
      { label: 'Server', value: this.product.name },
      { label: 'Family', value: this.product.family },
      { label: 'Hardware', value: this.hardwareLabel },
      { label: 'Region', value: this.region?.regionLabel ?? this.savedPlan.region },
      { label: 'Stock', value: this.region ? `${this.region.stock} units` : 'Check region' },
      { label: 'Setup', value: this.region ? `${this.region.setupHours} hours` : 'Check region' },
      { label: 'Support', value: this.product.supportTier },
      { label: 'Documents', value: this.product.documents.join(', ') },
    ];
  }

  get product(): CatalogProduct {
    const product =
      catalogSnapshot.products.find((item) => item.name === this.savedPlan.plan) ??
      catalogSnapshot.products[0];

    if (!product) {
      throw new Error('Catalog mock products are empty');
    }

    return product;
  }

  get productPath() {
    return `/catalog/${this.product.id}`;
  }

  get quotePath() {
    if (!this.region) {
      return `/quote?plan=${this.product.id}`;
    }

    return `/quote?plan=${this.product.id}&region=${this.region.regionId}`;
  }

  get region(): CatalogRegionAvailability | undefined {
    return this.product.availabilityByRegion.find(
      (region) => region.regionLabel === this.savedPlan.region,
    );
  }

  get relatedPlans() {
    return portalSavedPlans.filter(
      (plan) =>
        plan.organizationId === this.savedPlan.organizationId && plan.id !== this.savedPlan.id,
    );
  }

  get relatedQuotes() {
    return portalQuotes.filter(
      (quote) =>
        quote.organizationId === this.savedPlan.organizationId &&
        (quote.plan === this.savedPlan.plan || quote.region === this.savedPlan.region),
    );
  }

  get savedPlan(): PortalSavedPlan {
    const savedPlan =
      portalSavedPlans.find((item) => item.id === this.planId) ?? portalSavedPlans[0];

    if (!savedPlan) {
      throw new Error('Customer portal mock saved plans are empty');
    }

    return savedPlan;
  }

  setPlanId(planId: string | undefined) {
    this.planId = planId;
  }

  toggleFavorite() {
    if (this.isFavorited) {
      this.favoritedPlanIds = this.favoritedPlanIds.filter((id) => id !== this.savedPlan.id);
      return;
    }

    this.favoritedPlanIds = [...this.favoritedPlanIds, this.savedPlan.id];
  }

  private get hardwareLabel() {
    return `${this.product.hardware.cpuCores} cores, ${this.product.hardware.ramGb} GB RAM, ${this.product.hardware.storageTb} TB`;
  }
}
