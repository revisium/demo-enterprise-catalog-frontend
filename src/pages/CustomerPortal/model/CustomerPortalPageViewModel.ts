import { makeAutoObservable } from 'mobx';

import { type PortalDemoSession, type PortalMetric, type PortalQuote } from 'src/entities/portal';
import { CustomerPortalPageDataSource } from '../api/CustomerPortalPageDataSource';

type PortalSection = 'favorites' | 'plans' | 'quotes';

interface PortalActionField {
  readonly name: string;
  readonly value: string;
}

const sectionLabels: Record<PortalSection, string> = {
  favorites: 'Favorites',
  plans: 'Saved plans',
  quotes: 'Quotes',
};

export class CustomerPortalPageViewModel {
  private readonly dataSource = new CustomerPortalPageDataSource();

  favoritedPlanIds: readonly string[] = [];
  selectedOrganizationId: string;
  selectedSection: PortalSection = 'plans';

  constructor(readonly session: PortalDemoSession) {
    this.selectedOrganizationId = session.user.primaryOrganizationId;
    makeAutoObservable<this, 'dataSource'>(this, { dataSource: false });
  }

  get currentUser() {
    return this.session.user;
  }

  get activeOrganization() {
    return this.dataSource.getOrganization(this.selectedOrganizationId);
  }

  get auditEvents() {
    return this.dataSource.getAuditEvents(this.selectedOrganizationId, this.currentUser.id);
  }

  get favoriteItems() {
    return this.dataSource.getFavoriteItems(this.selectedOrganizationId, this.currentUser.id);
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
    return this.dataSource.getOrganizationOptions(this.currentUser);
  }

  get preferenceActionFields(): readonly PortalActionField[] {
    return this.createActionFields({
      currencyId: this.currentUser.preferences.currencyId,
      languageId: this.currentUser.preferences.languageId,
      organizationId: this.selectedOrganizationId,
      regionId: this.currentUser.preferences.preferredRegionId,
    });
  }

  get contentFeedbackActionFields(): readonly PortalActionField[] {
    return this.createActionFields({
      articleId: 'choose-production-server-plan',
      organizationId: this.selectedOrganizationId,
      updateId: 'singapore-storage-capacity-expanded',
    });
  }

  get preferenceRows() {
    return [
      {
        label: 'Language',
        value: this.dataSource.getLanguageLabel(this.currentUser.preferences.languageId),
      },
      { label: 'Currency', value: this.currentUser.preferences.currencyId.toUpperCase() },
      {
        label: 'Preferred region',
        value: this.dataSource.getRegionLabel(this.currentUser.preferences.preferredRegionId),
      },
    ];
  }

  get primaryQuote() {
    return this.quotes[0];
  }

  get quotes() {
    return this.dataSource.getQuotes(this.selectedOrganizationId, this.currentUser.id);
  }

  get savedPlans() {
    return this.dataSource.getSavedPlans(this.selectedOrganizationId, this.currentUser.id);
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
    return this.dataSource.getReferenceChecks(
      this.currentUser,
      this.selectedOrganizationId,
      this.savedPlans[0]?.plan,
    );
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
    return this.dataSource.getOrganization(organizationId);
  }

  getQuote(quoteId: string | undefined) {
    return this.dataSource.getQuote(quoteId);
  }

  getRelatedSavedPlans(quote: PortalQuote) {
    return this.dataSource.getRelatedSavedPlans(quote);
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

  private createActionFields(fields: Record<string, string>): readonly PortalActionField[] {
    return Object.entries(fields).map(([name, value]) => ({ name, value }));
  }
}
