import { makeAutoObservable } from 'mobx';

import {
  portalOrganizations,
  portalQuotes,
  portalSavedPlans,
  type PortalQuote,
} from 'src/entities/portal';

interface QuoteComment {
  readonly author: string;
  readonly body: string;
  readonly id: string;
  readonly role: string;
  readonly when: string;
}

interface TimelineItem {
  readonly label: string;
  readonly state: 'done' | 'next' | 'waiting';
  readonly summary: string;
}

const commentsByQuoteId: Record<string, readonly QuoteComment[]> = {
  'quote-business-vm-8-sin': [
    {
      author: 'Kai Tan',
      body: 'APAC launch date is confirmed. Please keep monitoring and backup in the first offer.',
      id: 'comment-business-vm-1',
      role: 'Customer admin',
      when: '3 hours ago',
    },
  ],
  'quote-db-d4-nyc': [
    {
      author: 'Noah Patel',
      body: 'Finance approved the monthly range. We still need a retention note for New York.',
      id: 'comment-db-1',
      role: 'Finance',
      when: 'Yesterday',
    },
    {
      author: 'Elena Ruiz',
      body: 'Added data-retention guidance and left the region approval as the only open item.',
      id: 'comment-db-2',
      role: 'Account manager',
      when: '6 hours ago',
    },
  ],
  'quote-dedicated-r2-fra': [
    {
      author: 'Mira Chen',
      body: 'Please keep the yearly term and enterprise support. Private VLAN is required for production.',
      id: 'comment-dedicated-r2-1',
      role: 'Customer owner',
      when: '2 hours ago',
    },
    {
      author: 'Lars Becker',
      body: 'Sales review is checking backup retention and final setup date for Frankfurt.',
      id: 'comment-dedicated-r2-2',
      role: 'Account manager',
      when: '45 minutes ago',
    },
  ],
};

const timelineByStatus: Record<PortalQuote['status'], readonly TimelineItem[]> = {
  'Customer reply': [
    {
      label: 'Draft prepared',
      state: 'done',
      summary: 'Plan, region, and monthly estimate are ready.',
    },
    {
      label: 'Customer reply',
      state: 'next',
      summary: 'Customer needs to confirm the remaining approval note.',
    },
    {
      label: 'Sales review',
      state: 'waiting',
      summary: 'Sales will validate the final bundle after reply.',
    },
  ],
  Draft: [
    {
      label: 'Draft prepared',
      state: 'next',
      summary: 'The first version is still being assembled.',
    },
    {
      label: 'Customer reply',
      state: 'waiting',
      summary: 'Customer confirmation is not requested yet.',
    },
    {
      label: 'Sales review',
      state: 'waiting',
      summary: 'Sales review starts after draft completion.',
    },
  ],
  'Sales review': [
    { label: 'Draft prepared', state: 'done', summary: 'Plan, region, and add-ons are selected.' },
    {
      label: 'Customer reply',
      state: 'done',
      summary: 'Customer requirements were added to the thread.',
    },
    {
      label: 'Sales review',
      state: 'next',
      summary: 'Sales validates terms, support, and setup date.',
    },
  ],
  Submitted: [
    { label: 'Draft prepared', state: 'done', summary: 'Plan, region, and add-ons are selected.' },
    { label: 'Sales review', state: 'done', summary: 'Terms were checked by sales.' },
    { label: 'Submitted', state: 'next', summary: 'The quote is waiting for final approval.' },
  ],
};

export class PortalQuoteDetailPageViewModel {
  quoteId: string | undefined;

  constructor(quoteId: string | undefined) {
    this.quoteId = quoteId;
    makeAutoObservable(this);
  }

  get comments() {
    return commentsByQuoteId[this.quote.id] ?? [];
  }

  get metrics() {
    return [
      { label: 'Status', value: this.quote.status },
      { label: 'Monthly', value: `$${this.quote.monthlyUsd}` },
      { label: 'Due', value: this.quote.due },
      { label: 'Comments', value: String(this.quote.commentCount) },
    ];
  }

  get organization() {
    const organization =
      portalOrganizations.find((item) => item.id === this.quote.organizationId) ??
      portalOrganizations[0];

    if (!organization) {
      throw new Error('Customer portal mock organizations are empty');
    }

    return organization;
  }

  get quote() {
    const quote = portalQuotes.find((item) => item.id === this.quoteId) ?? portalQuotes[0];

    if (!quote) {
      throw new Error('Customer portal mock quotes are empty');
    }

    return quote;
  }

  get relatedPlans() {
    return portalSavedPlans.filter(
      (plan) =>
        plan.organizationId === this.quote.organizationId &&
        (plan.plan === this.quote.plan || plan.region === this.quote.region),
    );
  }

  get timeline() {
    return timelineByStatus[this.quote.status];
  }

  setQuoteId(quoteId: string | undefined) {
    this.quoteId = quoteId;
  }
}
