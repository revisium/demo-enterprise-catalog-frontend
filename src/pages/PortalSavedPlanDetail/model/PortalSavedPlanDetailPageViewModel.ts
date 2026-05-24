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
  type PortalDemoSession,
  type PortalSavedPlan,
} from 'src/entities/portal';

interface PackageRow {
  readonly label: string;
  readonly value: string;
}

export class PortalSavedPlanDetailPageViewModel {
  favoritedPlanIds: readonly string[] = [];
  planId: string | undefined;
  readonly pricingPath = '/pricing';

  constructor(
    planId: string | undefined,
    readonly session: PortalDemoSession,
  ) {
    this.planId = planId;
    makeAutoObservable(this);
  }

  get accessRows() {
    return [
      { label: 'Signed-in user', value: this.session.user.name },
      { label: 'Allowed organizations', value: this.session.user.organizationIds.join(', ') },
      { label: 'Requested plan', value: this.planId ?? 'none' },
    ];
  }

  get canViewSavedPlan() {
    const savedPlan = this.savedPlan;

    return Boolean(
      savedPlan?.ownerUserId === this.session.user.id &&
      this.session.user.organizationIds.includes(savedPlan.organizationId),
    );
  }

  get isFavorited() {
    return this.favoritedPlanIds.includes(this.activeSavedPlan.id);
  }

  get locationPath() {
    return this.region ? `/locations/${this.region.regionId}` : '/locations';
  }

  get metrics() {
    return [
      { label: 'Status', value: this.activeSavedPlan.status },
      { label: 'Monthly', value: `$${this.activeSavedPlan.monthlyUsd}` },
      { label: 'Region', value: this.activeSavedPlan.region },
      { label: 'Quotes', value: String(this.relatedQuotes.length) },
    ];
  }

  get organization() {
    const organization =
      portalOrganizations.find((item) => item.id === this.activeSavedPlan.organizationId) ??
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
      { label: 'Region', value: this.region?.regionLabel ?? this.activeSavedPlan.region },
      { label: 'Stock', value: this.region ? `${this.region.stock} units` : 'Check region' },
      { label: 'Setup', value: this.region ? `${this.region.setupHours} hours` : 'Check region' },
      { label: 'Support', value: this.product.supportTier },
      { label: 'Documents', value: this.product.documents.join(', ') },
    ];
  }

  get product(): CatalogProduct {
    const product =
      catalogSnapshot.products.find((item) => item.name === this.activeSavedPlan.plan) ??
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
      (region) => region.regionLabel === this.activeSavedPlan.region,
    );
  }

  get relatedPlans() {
    return portalSavedPlans.filter(
      (plan) =>
        plan.organizationId === this.activeSavedPlan.organizationId &&
        plan.ownerUserId === this.session.user.id &&
        plan.id !== this.activeSavedPlan.id,
    );
  }

  get relatedQuotes() {
    return portalQuotes.filter(
      (quote) =>
        quote.organizationId === this.activeSavedPlan.organizationId &&
        quote.requesterUserId === this.session.user.id &&
        (quote.plan === this.activeSavedPlan.plan || quote.region === this.activeSavedPlan.region),
    );
  }

  get savedPlan(): PortalSavedPlan | undefined {
    return this.planId === undefined
      ? portalSavedPlans.find((plan) => plan.ownerUserId === this.session.user.id)
      : portalSavedPlans.find((item) => item.id === this.planId);
  }

  setPlanId(planId: string | undefined) {
    this.planId = planId;
  }

  toggleFavorite() {
    if (this.isFavorited) {
      this.favoritedPlanIds = this.favoritedPlanIds.filter((id) => id !== this.activeSavedPlan.id);
      return;
    }

    this.favoritedPlanIds = [...this.favoritedPlanIds, this.activeSavedPlan.id];
  }

  private get activeSavedPlan(): PortalSavedPlan {
    if (!this.savedPlan || !this.canViewSavedPlan) {
      throw new Error(`Saved plan unavailable for current user: ${this.planId ?? 'none'}`);
    }

    return this.savedPlan;
  }

  private get hardwareLabel() {
    return `${this.product.hardware.cpuCores} cores, ${this.product.hardware.ramGb} GB RAM, ${this.product.hardware.storageTb} TB`;
  }
}
