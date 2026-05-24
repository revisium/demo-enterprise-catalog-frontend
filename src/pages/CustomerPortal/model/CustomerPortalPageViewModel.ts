import { makeAutoObservable } from 'mobx';

import {
  portalAuditEvents,
  portalFavorites,
  portalOrganizations,
  portalQuotes,
  portalSavedPlans,
  type PortalDemoSession,
  type PortalMetric,
  type PortalQuote,
} from 'src/entities/portal';

type PortalSection = 'favorites' | 'plans' | 'quotes';

const sectionLabels: Record<PortalSection, string> = {
  favorites: 'Favorites',
  plans: 'Saved plans',
  quotes: 'Quotes',
};

export class CustomerPortalPageViewModel {
  favoritedPlanIds: readonly string[] = [];
  selectedOrganizationId: string;
  selectedSection: PortalSection = 'plans';

  constructor(readonly session: PortalDemoSession) {
    this.selectedOrganizationId = session.user.primaryOrganizationId;
    makeAutoObservable(this);
  }

  get currentUser() {
    return this.session.user;
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

  get auditEvents() {
    return portalAuditEvents.filter(
      (event) =>
        event.organizationId === this.selectedOrganizationId &&
        event.userId === this.currentUser.id,
    );
  }

  get favoriteItems() {
    return portalFavorites.filter(
      (favorite) =>
        favorite.organizationId === this.selectedOrganizationId &&
        favorite.ownerUserId === this.currentUser.id,
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
        label: 'Activity',
        summary: 'Recent organization events in this workspace.',
        value: String(this.auditEvents.length),
      },
    ];
  }

  get organizationOptions() {
    return portalOrganizations
      .filter((organization) => this.currentUser.organizationIds.includes(organization.id))
      .map((organization) => ({
        id: organization.id,
        label: organization.name,
      }));
  }

  get preferenceRows() {
    return [
      { label: 'Language', value: this.getLanguageLabel(this.currentUser.preferences.languageId) },
      { label: 'Currency', value: this.currentUser.preferences.currencyId.toUpperCase() },
      {
        label: 'Preferred region',
        value: this.getRegionLabel(this.currentUser.preferences.preferredRegionId),
      },
    ];
  }

  get primaryQuote() {
    return this.quotes[0];
  }

  get quotes() {
    return portalQuotes.filter(
      (quote) =>
        quote.organizationId === this.selectedOrganizationId &&
        quote.requesterUserId === this.currentUser.id,
    );
  }

  get savedPlans() {
    return portalSavedPlans.filter(
      (plan) =>
        plan.organizationId === this.selectedOrganizationId &&
        plan.ownerUserId === this.currentUser.id,
    );
  }

  get sessionRows() {
    return [
      { label: 'Role', value: this.currentUser.role },
      {
        label: 'Session',
        value: this.session.cookieMode === 'httpOnly' ? 'Secure cookie' : 'Demo',
      },
      {
        label: 'Device',
        value: this.session.fingerprintStatus === 'recognized' ? 'Recognized' : 'Created',
      },
    ];
  }

  get validationRows() {
    return [
      { label: 'User role', value: `${this.currentUser.role} can manage quotes` },
      {
        label: 'Language',
        value: `${this.getLanguageLabel(this.currentUser.preferences.languageId)} active`,
      },
      {
        label: 'Currency',
        value: `${this.currentUser.preferences.currencyId.toUpperCase()} allowed`,
      },
      {
        label: 'Region',
        value: `${this.getRegionLabel(this.currentUser.preferences.preferredRegionId)} available`,
      },
    ];
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

  private getLanguageLabel(languageId: string) {
    const labels: Record<string, string> = {
      ar: 'Arabic',
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      ru: 'Russian',
      zh: 'Chinese',
    };

    return labels[languageId] ?? languageId;
  }

  private getRegionLabel(regionId: string) {
    const labels: Record<string, string> = {
      'de-fra': 'Frankfurt',
      'nl-ams': 'Amsterdam',
      'sg-sin': 'Singapore',
      'us-nyc': 'New York',
    };

    return labels[regionId] ?? regionId;
  }
}
