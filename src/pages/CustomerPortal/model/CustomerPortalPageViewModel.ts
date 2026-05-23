import { makeAutoObservable } from 'mobx';

interface PortalMetric {
  readonly label: string;
  readonly value: string;
  readonly summary: string;
}

interface PortalAction {
  readonly title: string;
  readonly status: string;
  readonly summary: string;
}

const metrics: readonly PortalMetric[] = [
  {
    label: 'Saved plans',
    value: '8',
    summary: 'Server configurations kept by the organization.',
  },
  {
    label: 'Open quotes',
    value: '3',
    summary: 'Requests waiting for sales or customer response.',
  },
  {
    label: 'Favorites',
    value: '14',
    summary: 'Servers, regions, docs, and updates saved for later.',
  },
  {
    label: 'API keys',
    value: '2',
    summary: 'Partner integrations with active scoped access.',
  },
];

const actions: readonly PortalAction[] = [
  {
    title: 'Dedicated R2 quote',
    status: 'Sales review',
    summary: 'Frankfurt stock, yearly term, private VLAN, backup, and support add-ons.',
  },
  {
    title: 'Database D4 saved plan',
    status: 'Needs region',
    summary: 'High-memory server shortlist awaiting Frankfurt or New York decision.',
  },
  {
    title: 'Partner API onboarding',
    status: 'Security review',
    summary: 'API key request with quote lookup and availability scopes.',
  },
];

export class CustomerPortalPageViewModel {
  readonly metrics = metrics;
  readonly actions = actions;

  constructor() {
    makeAutoObservable(this);
  }

  get primaryAction() {
    return this.actions[0];
  }
}
