import {
  portalAuditEvents,
  portalFavorites,
  portalOrganizations,
  portalQuotes,
  portalSavedPlans,
  type PortalOrganization,
  type PortalQuote,
  type PortalUser,
} from 'src/entities/portal';

export type ReferenceStatus = 'Active' | 'Allowed' | 'Available' | 'Published';

export interface ReferenceCheckRow {
  readonly id: string;
  readonly label: string;
  readonly scope: 'Catalog' | 'Docs' | 'Preference';
  readonly status: ReferenceStatus;
  readonly value: string;
}

type ReferenceCheckTuple = readonly [
  string,
  string,
  ReferenceCheckRow['scope'],
  ReferenceStatus,
  string,
];

export class CustomerPortalPageDataSource {
  getAuditEvents(organizationId: string, userId: string) {
    return portalAuditEvents.filter(
      (event) => event.organizationId === organizationId && event.userId === userId,
    );
  }

  getFavoriteItems(organizationId: string, userId: string) {
    return portalFavorites.filter(
      (favorite) => favorite.organizationId === organizationId && favorite.ownerUserId === userId,
    );
  }

  getOrganization(organizationId: string): PortalOrganization {
    const organization =
      portalOrganizations.find((item) => item.id === organizationId) ?? portalOrganizations[0];

    if (!organization) {
      throw new Error('Customer portal mock organizations are empty');
    }

    return organization;
  }

  getOrganizationOptions(user: PortalUser) {
    return portalOrganizations
      .filter((organization) => user.organizationIds.includes(organization.id))
      .map((organization) => ({
        id: organization.id,
        label: organization.name,
      }));
  }

  getQuote(quoteId: string | undefined): PortalQuote {
    const quote = portalQuotes.find((item) => item.id === quoteId) ?? portalQuotes[0];

    if (!quote) {
      throw new Error('Customer portal mock quotes are empty');
    }

    return quote;
  }

  getQuotes(organizationId: string, userId: string) {
    return portalQuotes.filter(
      (quote) => quote.organizationId === organizationId && quote.requesterUserId === userId,
    );
  }

  getReferenceChecks(
    user: PortalUser,
    organizationId: string,
    primarySavedPlanName: string | undefined,
  ): readonly ReferenceCheckRow[] {
    const rows: readonly ReferenceCheckTuple[] = [
      [
        'language',
        'Language',
        'Preference',
        'Active',
        this.getLanguageLabel(user.preferences.languageId),
      ],
      ['currency', 'Currency', 'Preference', 'Allowed', user.preferences.currencyId.toUpperCase()],
      [
        'region',
        'Preferred region',
        'Catalog',
        'Available',
        this.getRegionLabel(user.preferences.preferredRegionId),
      ],
      ['saved-plan', 'Saved plan', 'Catalog', 'Active', primarySavedPlanName ?? 'No saved plan'],
      ['saved-guide', 'Saved guide', 'Docs', 'Published', 'Choose a production server plan'],
    ];

    return rows.map((row) => this.toReferenceCheck(organizationId, row));
  }

  getRelatedSavedPlans(quote: PortalQuote) {
    return portalSavedPlans.filter(
      (plan) =>
        plan.organizationId === quote.organizationId &&
        (plan.plan === quote.plan || plan.region === quote.region),
    );
  }

  getSavedPlans(organizationId: string, userId: string) {
    return portalSavedPlans.filter(
      (plan) => plan.organizationId === organizationId && plan.ownerUserId === userId,
    );
  }

  getLanguageLabel(languageId: string) {
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

  getRegionLabel(regionId: string) {
    const labels: Record<string, string> = {
      'de-fra': 'Frankfurt',
      'nl-ams': 'Amsterdam',
      'sg-sin': 'Singapore',
      'us-nyc': 'New York',
    };

    return labels[regionId] ?? regionId;
  }

  private toReferenceCheck(
    organizationId: string,
    [id, label, scope, status, value]: ReferenceCheckTuple,
  ): ReferenceCheckRow {
    return {
      id: `${organizationId}-${id}`,
      label,
      scope,
      status,
      value,
    };
  }
}
