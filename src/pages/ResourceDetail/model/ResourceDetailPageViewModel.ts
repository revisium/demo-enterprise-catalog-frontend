import { makeAutoObservable } from 'mobx';

import { resourceArticles, type ResourceArticle } from 'src/entities/content';

interface DetailSection {
  readonly body: string;
  readonly title: string;
}

interface LinkItem {
  readonly href: string;
  readonly label: string;
  readonly summary: string;
}

const sectionCopy: Record<ResourceArticle['category'], readonly DetailSection[]> = {
  API: [
    {
      body: 'Use organization-scoped keys for availability checks, quote lookup, and finance export jobs. Keep write scopes separate from read-only integrations.',
      title: 'Recommended integration shape',
    },
    {
      body: 'Start with availability and price reads, then add quote writes only after the buying workflow is approved by the account owner.',
      title: 'Rollout sequence',
    },
  ],
  'Buying guide': [
    {
      body: 'Shortlist plans by workload type, required region, setup deadline, and support expectation before comparing the monthly total.',
      title: 'Selection order',
    },
    {
      body: 'Carry backup, monitoring, private networking, and public IP requirements into the quote so procurement reviews the real bundle.',
      title: 'Quote preparation',
    },
  ],
  Networking: [
    {
      body: 'Confirm public IPv4, private VLAN, bandwidth, firewall ownership, and support coverage before a server plan is shared with operations.',
      title: 'Network readiness',
    },
    {
      body: 'Prefer a nearby alternative region when the primary location has longer setup windows or lower stock for the same server family.',
      title: 'Regional fallback',
    },
  ],
  Operations: [
    {
      body: 'Define restore ownership, monitoring alerts, retention windows, and escalation contacts before the plan reaches production.',
      title: 'Operating model',
    },
    {
      body: 'Attach backup policy and support terms to quote approvals so finance and operations review the same operating assumptions.',
      title: 'Approval packet',
    },
  ],
  Security: [
    {
      body: 'Review account members, API scopes, billing recipients, and quote approvers before every renewal or regional expansion.',
      title: 'Access control',
    },
    {
      body: 'Use audit history and saved account notes to explain who changed keys, quotes, favorites, and organization settings.',
      title: 'Review evidence',
    },
  ],
};

const checklistCopy: Record<ResourceArticle['category'], readonly string[]> = {
  API: [
    'Create a read-only key first',
    'Limit quote writes to trusted systems',
    'Review key usage weekly',
  ],
  'Buying guide': [
    'Confirm region and support needs',
    'Compare effective monthly totals',
    'Prepare add-ons before quote',
  ],
  Networking: [
    'Confirm IP and VLAN needs',
    'Check bandwidth expectations',
    'Validate regional setup time',
  ],
  Operations: ['Choose backup retention', 'Assign restore owner', 'Confirm monitoring escalation'],
  Security: ['Review members', 'Check API scopes', 'Confirm billing contact'],
};

export class ResourceDetailPageViewModel {
  helpfulArticleIds: readonly string[] = [];
  articleId: string | undefined;
  savedArticleIds: readonly string[] = ['choose-production-server-plan'];

  constructor(articleId: string | undefined) {
    this.articleId = articleId;
    makeAutoObservable(this);
  }

  get article() {
    return this.getArticle(this.articleId);
  }

  get checklistItems() {
    return checklistCopy[this.article.category];
  }

  get detailSections() {
    return sectionCopy[this.article.category];
  }

  get isHelpful() {
    return this.helpfulArticleIds.includes(this.article.id);
  }

  get isSaved() {
    return this.savedArticleIds.includes(this.article.id);
  }

  get metrics() {
    return [
      { label: 'Read time', value: `${this.article.readTimeMinutes} min` },
      { label: 'Helpful', value: String(this.getHelpfulCount(this.article)) },
      { label: 'Topic', value: this.article.relatedTopic },
      { label: 'Updated', value: this.article.updatedAt },
    ];
  }

  get quickLinks(): readonly LinkItem[] {
    return [
      {
        href: '/catalog',
        label: 'Open catalog',
        summary: 'Compare server plans that match this guide.',
      },
      {
        href: '/quote',
        label: 'Prepare quote',
        summary: 'Carry the selected plan and add-ons into a request.',
      },
      {
        href: '/app',
        label: 'Customer portal',
        summary: 'Review saved plans, API keys, and account activity.',
      },
    ];
  }

  get relatedArticles() {
    return resourceArticles
      .filter((candidate) => candidate.id !== this.article.id)
      .map((candidate) => ({
        article: candidate,
        score:
          this.getSharedTagCount(this.article, candidate) +
          Number(candidate.category === this.article.category),
      }))
      .sort(
        (left, right) =>
          right.score - left.score || left.article.title.localeCompare(right.article.title),
      )
      .slice(0, 3)
      .map((candidate) => candidate.article);
  }

  setArticleId(articleId: string | undefined) {
    this.articleId = articleId;
  }

  toggleHelpful() {
    this.helpfulArticleIds = this.toggleValue(this.helpfulArticleIds, this.article.id);
  }

  toggleSaved() {
    this.savedArticleIds = this.toggleValue(this.savedArticleIds, this.article.id);
  }

  private getArticle(articleId: string | undefined) {
    const article = resourceArticles.find((item) => item.id === articleId) ?? resourceArticles[0];

    if (!article) {
      throw new Error('Resource article mocks are empty');
    }

    return article;
  }

  private getHelpfulCount(article: ResourceArticle) {
    return article.helpfulCount + (this.helpfulArticleIds.includes(article.id) ? 1 : 0);
  }

  private getSharedTagCount(left: ResourceArticle, right: ResourceArticle) {
    const rightTags = new Set(right.tags);

    return left.tags.filter((tag) => rightTags.has(tag)).length;
  }

  private toggleValue(values: readonly string[], value: string) {
    return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
  }
}
