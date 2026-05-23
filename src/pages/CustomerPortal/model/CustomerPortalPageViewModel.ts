import { makeAutoObservable } from 'mobx';

interface PortalMetric {
  readonly label: string;
  readonly value: string;
  readonly summary: string;
}

interface PortalAction {
  readonly due: string;
  readonly title: string;
  readonly status: string;
  readonly summary: string;
}

interface PortalSavedPlan {
  readonly id: string;
  readonly name: string;
  readonly plan: string;
  readonly region: string;
  readonly monthlyUsd: number;
  readonly status: 'Draft' | 'Ready for quote' | 'Shared';
}

interface PortalApiKey {
  readonly name: string;
  readonly scope: string;
  readonly lastUsed: string;
  readonly status: 'Active' | 'Review';
}

type PortalSection = 'api' | 'favorites' | 'plans' | 'quotes';

const actions: readonly PortalAction[] = [
  {
    due: 'Today',
    title: 'Dedicated R2 quote',
    status: 'Sales review',
    summary: 'Frankfurt stock, yearly term, private VLAN, backup, and support add-ons.',
  },
  {
    due: 'Tomorrow',
    title: 'Database D4 saved plan',
    status: 'Needs region',
    summary: 'High-memory server shortlist awaiting Frankfurt or New York decision.',
  },
  {
    due: 'This week',
    title: 'Partner API onboarding',
    status: 'Security review',
    summary: 'API key request with quote lookup and availability scopes.',
  },
];

const apiKeys: readonly PortalApiKey[] = [
  {
    lastUsed: '2 hours ago',
    name: 'Partner quoting API',
    scope: 'Quotes, availability',
    status: 'Active',
  },
  {
    lastUsed: 'Yesterday',
    name: 'Finance export',
    scope: 'Price rows',
    status: 'Review',
  },
];

const savedPlans: readonly PortalSavedPlan[] = [
  {
    id: 'plan-dedicated-r2-fra',
    monthlyUsd: 310,
    name: 'Frankfurt production app',
    plan: 'Dedicated R2',
    region: 'Frankfurt',
    status: 'Ready for quote',
  },
  {
    id: 'plan-db-d4-nyc',
    monthlyUsd: 420,
    name: 'Analytics database',
    plan: 'Database D4',
    region: 'New York',
    status: 'Draft',
  },
  {
    id: 'plan-storage-s3-sin',
    monthlyUsd: 180,
    name: 'APAC backup target',
    plan: 'Storage S3',
    region: 'Singapore',
    status: 'Shared',
  },
];

const sectionLabels: Record<PortalSection, string> = {
  api: 'API keys',
  favorites: 'Favorites',
  plans: 'Saved plans',
  quotes: 'Quotes',
};

const metrics: readonly PortalMetric[] = [
  {
    label: 'Saved plans',
    value: String(savedPlans.length),
    summary: 'Server configurations kept by the organization.',
  },
  {
    label: 'Open quotes',
    value: String(actions.length),
    summary: 'Requests waiting for sales or customer response.',
  },
  {
    label: 'Favorites',
    value: '14',
    summary: 'Servers, regions, docs, and updates saved for later.',
  },
  {
    label: 'API keys',
    value: String(apiKeys.length),
    summary: 'Partner integrations with active scoped access.',
  },
];

export class CustomerPortalPageViewModel {
  readonly apiKeys = apiKeys;
  readonly metrics = metrics;
  readonly actions = actions;
  readonly savedPlans = savedPlans;
  favoritedPlanIds: readonly string[] = ['plan-dedicated-r2-fra'];
  selectedSection: PortalSection = 'plans';

  constructor() {
    makeAutoObservable(this);
  }

  get primaryAction() {
    return this.actions[0];
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

  selectSection(section: PortalSection) {
    this.selectedSection = section;
  }

  toggleFavorite(planId: string) {
    this.favoritedPlanIds = this.favoritedPlanIds.includes(planId)
      ? this.favoritedPlanIds.filter((id) => id !== planId)
      : [...this.favoritedPlanIds, planId];
  }

  isFavorited(planId: string) {
    return this.favoritedPlanIds.includes(planId);
  }
}
