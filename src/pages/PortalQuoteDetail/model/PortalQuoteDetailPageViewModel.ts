import { makeAutoObservable } from 'mobx';

import {
  portalOrganizations,
  portalQuotes,
  portalSavedPlans,
  type PortalDemoSession,
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

  constructor(
    quoteId: string | undefined,
    readonly session: PortalDemoSession,
  ) {
    this.quoteId = quoteId;
    makeAutoObservable(this);
  }

  get accessRows() {
    return [
      { label: 'Signed-in user', value: this.session.user.name },
      { label: 'Allowed organizations', value: this.session.user.organizationIds.join(', ') },
      { label: 'Requested quote', value: this.quoteId ?? 'none' },
    ];
  }

  get canViewQuote() {
    const quote = this.quote;

    return Boolean(
      quote?.requesterUserId === this.session.user.id &&
      this.session.user.organizationIds.includes(quote.organizationId),
    );
  }

  get comments() {
    return commentsByQuoteId[this.activeQuote.id] ?? [];
  }

  get metrics() {
    return [
      { label: 'Status', value: this.activeQuote.status },
      { label: 'Monthly', value: `$${this.activeQuote.monthlyUsd}` },
      { label: 'Due', value: this.activeQuote.due },
      { label: 'Comments', value: String(this.activeQuote.commentCount) },
    ];
  }

  get organization() {
    const organization =
      portalOrganizations.find((item) => item.id === this.activeQuote.organizationId) ??
      portalOrganizations[0];

    if (!organization) {
      throw new Error('Customer portal mock organizations are empty');
    }

    return organization;
  }

  get quote() {
    return this.quoteId === undefined
      ? portalQuotes.find((item) => item.requesterUserId === this.session.user.id)
      : portalQuotes.find((item) => item.id === this.quoteId);
  }

  get relatedPlans() {
    return portalSavedPlans.filter(
      (plan) =>
        plan.organizationId === this.activeQuote.organizationId &&
        plan.ownerUserId === this.session.user.id &&
        (plan.plan === this.activeQuote.plan || plan.region === this.activeQuote.region),
    );
  }

  get timeline() {
    return timelineByStatus[this.activeQuote.status];
  }

  setQuoteId(quoteId: string | undefined) {
    this.quoteId = quoteId;
  }

  private get activeQuote(): PortalQuote {
    if (!this.quote || !this.canViewQuote) {
      throw new Error(`Quote unavailable for current user: ${this.quoteId ?? 'none'}`);
    }

    return this.quote;
  }
}
