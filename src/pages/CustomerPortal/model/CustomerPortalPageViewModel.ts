import { makeAutoObservable } from 'mobx';

import {
  portalApiKeys,
  portalAuditEvents,
  portalFavorites,
  portalOrganizations,
  portalQuotes,
  portalSavedPlans,
  type PortalMetric,
  type PortalQuote,
} from 'src/entities/portal';

type PortalSection = 'api' | 'favorites' | 'plans' | 'quotes';

const sectionLabels: Record<PortalSection, string> = {
  api: 'API keys',
  favorites: 'Favorites',
  plans: 'Saved plans',
  quotes: 'Quotes',
};

export class CustomerPortalPageViewModel {
  favoritedPlanIds: readonly string[] = ['plan-dedicated-r2-fra'];
  selectedOrganizationId = portalOrganizations[0]?.id ?? '';
  selectedSection: PortalSection = 'plans';

  constructor() {
    makeAutoObservable(this);
  }

  get activeOrganization() {
    const organization =
      portalOrganizations.find((organization) => organization.id === this.selectedOrganizationId) ??
      portalOrganizations[0];

    if (!organization) {
      throw new Error('Customer portal mock organizations are empty');
    }

    return organization;
  }

  get apiKeys() {
    return portalApiKeys.filter((apiKey) => apiKey.organizationId === this.selectedOrganizationId);
  }

  get auditEvents() {
    return portalAuditEvents.filter(
      (event) => event.organizationId === this.selectedOrganizationId,
    );
  }

  get favoriteItems() {
    return portalFavorites.filter(
      (favorite) => favorite.organizationId === this.selectedOrganizationId,
    );
  }

  get favoritePlans() {
    return this.savedPlans.filter((plan) => this.favoritedPlanIds.includes(plan.id));
  }

  get metrics(): readonly PortalMetric[] {
    return [
      {
        label: 'Saved plans',
        summary: 'Server configurations kept by this organization.',
        value: String(this.savedPlans.length),
      },
      {
        label: 'Open quotes',
        summary: 'Requests waiting for sales or customer response.',
        value: String(this.quotes.length),
      },
      {
        label: 'Favorites',
        summary: 'Servers, regions, docs, and updates saved for later.',
        value: String(this.favoriteItems.length + this.favoritePlans.length),
      },
      {
        label: 'API keys',
        summary: 'Partner integrations with active scoped access.',
        value: String(this.apiKeys.length),
      },
    ];
  }

  get organizationOptions() {
    return portalOrganizations.map((organization) => ({
      id: organization.id,
      label: organization.name,
    }));
  }

  get primaryQuote() {
    return this.quotes[0];
  }

  get quotes() {
    return portalQuotes.filter((quote) => quote.organizationId === this.selectedOrganizationId);
  }

  get savedPlans() {
    return portalSavedPlans.filter((plan) => plan.organizationId === this.selectedOrganizationId);
  }

  get sectionOptions() {
    return (Object.keys(sectionLabels) as PortalSection[]).map((id) => ({
      id,
      label: sectionLabels[id],
    }));
  }

  get selectedSectionLabel() {
    return sectionLabels[this.selectedSection];
  }

  get visiblePlans() {
    return this.selectedSection === 'favorites' ? this.favoritePlans : this.savedPlans;
  }

  getOrganization(organizationId: string) {
    const organization =
      portalOrganizations.find((item) => item.id === organizationId) ?? portalOrganizations[0];

    if (!organization) {
      throw new Error('Customer portal mock organizations are empty');
    }

    return organization;
  }

  getQuote(quoteId: string | undefined) {
    const quote = portalQuotes.find((item) => item.id === quoteId) ?? portalQuotes[0];

    if (!quote) {
      throw new Error('Customer portal mock quotes are empty');
    }

    return quote;
  }

  getRelatedSavedPlans(quote: PortalQuote) {
    return portalSavedPlans.filter(
      (plan) =>
        plan.organizationId === quote.organizationId &&
        (plan.plan === quote.plan || plan.region === quote.region),
    );
  }

  isFavorited(planId: string) {
    return this.favoritedPlanIds.includes(planId);
  }

  selectOrganization(organizationId: string) {
    this.selectedOrganizationId = organizationId;
    this.selectedSection = 'plans';
  }

  selectSection(section: PortalSection) {
    this.selectedSection = section;
  }

  toggleFavorite(planId: string) {
    this.favoritedPlanIds = this.favoritedPlanIds.includes(planId)
      ? this.favoritedPlanIds.filter((id) => id !== planId)
      : [...this.favoritedPlanIds, planId];
  }
}
