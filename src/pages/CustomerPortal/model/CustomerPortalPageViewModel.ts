import { makeAutoObservable } from 'mobx';

interface PortalMetric {
  readonly label: string;
  readonly summary: string;
  readonly value: string;
}

interface PortalOrganization {
  readonly billingContact: string;
  readonly homeRegion: string;
  readonly id: string;
  readonly memberCount: number;
  readonly name: string;
  readonly supportPlan: string;
}

interface PortalQuote {
  readonly commentCount: number;
  readonly due: string;
  readonly id: string;
  readonly monthlyUsd: number;
  readonly organizationId: string;
  readonly plan: string;
  readonly region: string;
  readonly status: 'Customer reply' | 'Draft' | 'Sales review' | 'Submitted';
  readonly summary: string;
  readonly updatedAt: string;
}

interface PortalSavedPlan {
  readonly id: string;
  readonly monthlyUsd: number;
  readonly name: string;
  readonly organizationId: string;
  readonly plan: string;
  readonly region: string;
  readonly status: 'Draft' | 'Ready for quote' | 'Shared';
}

interface PortalFavorite {
  readonly id: string;
  readonly organizationId: string;
  readonly summary: string;
  readonly title: string;
  readonly type: 'Docs' | 'Region' | 'Server' | 'Update';
}

interface PortalApiKey {
  readonly createdBy: string;
  readonly id: string;
  readonly lastUsed: string;
  readonly name: string;
  readonly organizationId: string;
  readonly scopes: readonly string[];
  readonly status: 'Active' | 'Review';
}

interface PortalAuditEvent {
  readonly actor: string;
  readonly event: string;
  readonly id: string;
  readonly organizationId: string;
  readonly scope: string;
  readonly when: string;
}

type PortalSection = 'api' | 'favorites' | 'plans' | 'quotes';

const organizations: readonly PortalOrganization[] = [
  {
    billingContact: 'finance@northwind.example',
    homeRegion: 'Frankfurt',
    id: 'northwind',
    memberCount: 8,
    name: 'Northwind Manufacturing',
    supportPlan: 'Enterprise',
  },
  {
    billingContact: 'ops@orbit.example',
    homeRegion: 'Singapore',
    id: 'orbit',
    memberCount: 5,
    name: 'Orbit Media Group',
    supportPlan: 'Business',
  },
];

const quotes: readonly PortalQuote[] = [
  {
    commentCount: 5,
    due: 'Today',
    id: 'quote-dedicated-r2-fra',
    monthlyUsd: 930,
    organizationId: 'northwind',
    plan: 'Dedicated R2',
    region: 'Frankfurt',
    status: 'Sales review',
    summary: 'Yearly term, private VLAN, backup, monitoring, and enterprise support.',
    updatedAt: '2 hours ago',
  },
  {
    commentCount: 2,
    due: 'Tomorrow',
    id: 'quote-db-d4-nyc',
    monthlyUsd: 420,
    organizationId: 'northwind',
    plan: 'Database D4',
    region: 'New York',
    status: 'Customer reply',
    summary: 'Waiting for final region approval and data-retention note.',
    updatedAt: 'Yesterday',
  },
  {
    commentCount: 1,
    due: 'This week',
    id: 'quote-business-vm-8-sin',
    monthlyUsd: 180,
    organizationId: 'orbit',
    plan: 'Business VM 8',
    region: 'Singapore',
    status: 'Submitted',
    summary: 'APAC launch bundle with backup and monitoring add-ons.',
    updatedAt: '3 hours ago',
  },
];

const savedPlans: readonly PortalSavedPlan[] = [
  {
    id: 'plan-dedicated-r2-fra',
    monthlyUsd: 310,
    name: 'Frankfurt production app',
    organizationId: 'northwind',
    plan: 'Dedicated R2',
    region: 'Frankfurt',
    status: 'Ready for quote',
  },
  {
    id: 'plan-db-d4-nyc',
    monthlyUsd: 420,
    name: 'Analytics database',
    organizationId: 'northwind',
    plan: 'Database D4',
    region: 'New York',
    status: 'Draft',
  },
  {
    id: 'plan-storage-s3-sin',
    monthlyUsd: 180,
    name: 'APAC backup target',
    organizationId: 'orbit',
    plan: 'Storage S3',
    region: 'Singapore',
    status: 'Shared',
  },
];

const favorites: readonly PortalFavorite[] = [
  {
    id: 'favorite-dedicated-r2',
    organizationId: 'northwind',
    summary: 'Pinned for the production app renewal.',
    title: 'Dedicated R2',
    type: 'Server',
  },
  {
    id: 'favorite-frankfurt',
    organizationId: 'northwind',
    summary: 'Preferred EU location for regulated workloads.',
    title: 'Frankfurt data center',
    type: 'Region',
  },
  {
    id: 'favorite-release-2026-05',
    organizationId: 'orbit',
    summary: 'APAC stock and pricing update.',
    title: 'May regional capacity update',
    type: 'Update',
  },
];

const apiKeys: readonly PortalApiKey[] = [
  {
    createdBy: 'Mira Chen',
    id: 'key-partner-quote',
    lastUsed: '2 hours ago',
    name: 'Partner quoting API',
    organizationId: 'northwind',
    scopes: ['quotes:read', 'availability:read'],
    status: 'Active',
  },
  {
    createdBy: 'Noah Patel',
    id: 'key-finance-export',
    lastUsed: 'Yesterday',
    name: 'Finance export',
    organizationId: 'northwind',
    scopes: ['prices:read', 'invoices:read'],
    status: 'Review',
  },
  {
    createdBy: 'Kai Tan',
    id: 'key-apac-checkout',
    lastUsed: '4 hours ago',
    name: 'APAC checkout API',
    organizationId: 'orbit',
    scopes: ['quotes:write', 'availability:read'],
    status: 'Active',
  },
];

const auditEvents: readonly PortalAuditEvent[] = [
  {
    actor: 'Mira Chen',
    event: 'Added backup add-on to Dedicated R2 quote',
    id: 'audit-1',
    organizationId: 'northwind',
    scope: 'Quote',
    when: '2 hours ago',
  },
  {
    actor: 'Noah Patel',
    event: 'Requested finance export key review',
    id: 'audit-2',
    organizationId: 'northwind',
    scope: 'API',
    when: 'Yesterday',
  },
  {
    actor: 'Kai Tan',
    event: 'Shared APAC backup target with procurement',
    id: 'audit-3',
    organizationId: 'orbit',
    scope: 'Saved plan',
    when: '3 hours ago',
  },
];

const sectionLabels: Record<PortalSection, string> = {
  api: 'API keys',
  favorites: 'Favorites',
  plans: 'Saved plans',
  quotes: 'Quotes',
};

export class CustomerPortalPageViewModel {
  favoritedPlanIds: readonly string[] = ['plan-dedicated-r2-fra'];
  selectedOrganizationId = organizations[0]?.id ?? '';
  selectedSection: PortalSection = 'plans';

  constructor() {
    makeAutoObservable(this);
  }

  get activeOrganization() {
    const organization =
      organizations.find((organization) => organization.id === this.selectedOrganizationId) ??
      organizations[0];

    if (!organization) {
      throw new Error('Customer portal mock organizations are empty');
    }

    return organization;
  }

  get apiKeys() {
    return apiKeys.filter((apiKey) => apiKey.organizationId === this.selectedOrganizationId);
  }

  get auditEvents() {
    return auditEvents.filter((event) => event.organizationId === this.selectedOrganizationId);
  }

  get favoriteItems() {
    return favorites.filter((favorite) => favorite.organizationId === this.selectedOrganizationId);
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
    return organizations.map((organization) => ({
      id: organization.id,
      label: organization.name,
    }));
  }

  get primaryQuote() {
    return this.quotes[0];
  }

  get quotes() {
    return quotes.filter((quote) => quote.organizationId === this.selectedOrganizationId);
  }

  get savedPlans() {
    return savedPlans.filter((plan) => plan.organizationId === this.selectedOrganizationId);
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
