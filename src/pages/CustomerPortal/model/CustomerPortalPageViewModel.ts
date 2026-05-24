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
type ReferenceStatus = 'Active' | 'Allowed' | 'Available' | 'Published';

interface ReferenceCheckRow {
  readonly id: string;
  readonly label: string;
  readonly scope: string;
  readonly status: ReferenceStatus;
  readonly value: string;
}

type ReferenceCheckTuple = readonly [string, string, string, ReferenceStatus, string];

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

  get preferenceActionPayload() {
    return {
      currencyId: this.currentUser.preferences.currencyId,
      languageId: this.currentUser.preferences.languageId,
      organizationId: this.selectedOrganizationId,
      regionId: this.currentUser.preferences.preferredRegionId,
    };
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

  get sourceFeedbackSample() {
    return {
      articleId: 'choose-production-server-plan',
      organizationId: this.selectedOrganizationId,
      updateId: 'singapore-storage-capacity-expanded',
    };
  }

  get validationRows() {
    const primaryPlan = this.savedPlans[0];
    const rows: readonly ReferenceCheckTuple[] = [
      [
        'language',
        'Language',
        'Preference',
        'Active',
        this.getLanguageLabel(this.currentUser.preferences.languageId),
      ],
      [
        'currency',
        'Currency',
        'Preference',
        'Allowed',
        this.currentUser.preferences.currencyId.toUpperCase(),
      ],
      [
        'region',
        'Preferred region',
        'Catalog',
        'Available',
        this.getRegionLabel(this.currentUser.preferences.preferredRegionId),
      ],
      ['saved-plan', 'Saved plan', 'Catalog', 'Active', primaryPlan?.plan ?? 'No saved plan'],
      ['saved-guide', 'Saved guide', 'Docs', 'Published', 'Choose a production server plan'],
    ];

    return rows.map((row) => this.toReferenceCheck(row));
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

  private toReferenceCheck([
    id,
    label,
    scope,
    status,
    value,
  ]: ReferenceCheckTuple): ReferenceCheckRow {
    return {
      id,
      label,
      scope,
      status,
      value,
    };
  }
}
