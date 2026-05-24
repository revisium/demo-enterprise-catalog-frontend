import { makeAutoObservable } from 'mobx';

import { releaseUpdates, type ReleaseUpdate } from 'src/entities/content';

interface DetailSection {
  readonly body: string;
  readonly title: string;
}

interface AffectedPath {
  readonly href: string;
  readonly label: string;
  readonly summary: string;
}

const affectedPathsByType: Record<ReleaseUpdate['type'], readonly AffectedPath[]> = {
  Catalog: [
    { href: '/catalog', label: 'Catalog', summary: 'Review available server plans and stock.' },
    {
      href: '/compare',
      label: 'Compare',
      summary: 'Check whether the update changes a shortlist.',
    },
  ],
  Docs: [
    { href: '/resources', label: 'Resources', summary: 'Open the customer documentation library.' },
    { href: '/app', label: 'Console', summary: 'Save the update for an account workspace.' },
  ],
  Pricing: [
    {
      href: '/pricing',
      label: 'Pricing',
      summary: 'Inspect current and upcoming commercial rows.',
    },
    { href: '/quote', label: 'Quote', summary: 'Prepare a quote with the refreshed terms.' },
  ],
  Region: [
    {
      href: '/locations',
      label: 'Locations',
      summary: 'Compare regional stock and setup windows.',
    },
    { href: '/catalog', label: 'Catalog', summary: 'Find plans available in the updated market.' },
  ],
};

const sectionCopy: Record<ReleaseUpdate['type'], readonly DetailSection[]> = {
  Catalog: [
    {
      body: 'Customer-facing catalog pages now surface the changed availability so sales and procurement can discuss the same plan set.',
      title: 'What changed',
    },
    {
      body: 'Open affected server plans, compare nearby alternatives, and decide whether the update should be carried into an active quote.',
      title: 'Recommended follow-up',
    },
  ],
  Docs: [
    {
      body: 'Guides and support notes were refreshed so customers can review current expectations before they approve a request.',
      title: 'What changed',
    },
    {
      body: 'Share the updated guide with the account owner when the topic appears in a renewal, API rollout, or approval packet.',
      title: 'Recommended follow-up',
    },
  ],
  Pricing: [
    {
      body: 'Commercial rows are ready for review with clear contract terms, regional context, and renewal impact.',
      title: 'What changed',
    },
    {
      body: 'Compare the price-book view with active quotes before sending a final monthly total to finance.',
      title: 'Recommended follow-up',
    },
  ],
  Region: [
    {
      body: 'Regional availability, setup windows, or market support changed for customers planning capacity in that location.',
      title: 'What changed',
    },
    {
      body: 'Review location detail and catalog rows before promising a setup date or moving a quote to review.',
      title: 'Recommended follow-up',
    },
  ],
};

export class ReleaseDetailPageViewModel {
  likedUpdateIds: readonly string[] = [];
  savedUpdateIds: readonly string[] = ['q3-price-book-draft-opened'];
  updateId: string | undefined;

  constructor(updateId: string | undefined) {
    this.updateId = updateId;
    makeAutoObservable(this);
  }

  get affectedPaths() {
    return affectedPathsByType[this.update.type];
  }

  get detailSections() {
    return sectionCopy[this.update.type];
  }

  get isLiked() {
    return this.likedUpdateIds.includes(this.update.id);
  }

  get isSaved() {
    return this.savedUpdateIds.includes(this.update.id);
  }

  get metrics() {
    return [
      { label: 'Date', value: this.update.date },
      { label: 'Priority', value: this.update.priority },
      { label: 'Audience', value: this.update.audience },
      { label: 'Reactions', value: String(this.getLikedCount(this.update)) },
    ];
  }

  get relatedUpdates() {
    return releaseUpdates
      .filter((candidate) => candidate.id !== this.update.id)
      .map((candidate) => ({
        score:
          this.getSharedTagCount(this.update, candidate) +
          Number(candidate.type === this.update.type),
        update: candidate,
      }))
      .sort(
        (left, right) =>
          right.score - left.score || Date.parse(right.update.date) - Date.parse(left.update.date),
      )
      .slice(0, 3)
      .map((candidate) => candidate.update);
  }

  get update() {
    return this.getUpdate(this.updateId);
  }

  setUpdateId(updateId: string | undefined) {
    this.updateId = updateId;
  }

  toggleLike() {
    this.likedUpdateIds = this.toggleValue(this.likedUpdateIds, this.update.id);
  }

  toggleSaved() {
    this.savedUpdateIds = this.toggleValue(this.savedUpdateIds, this.update.id);
  }

  private getLikedCount(update: ReleaseUpdate) {
    return update.likedCount + (this.likedUpdateIds.includes(update.id) ? 1 : 0);
  }

  private getSharedTagCount(left: ReleaseUpdate, right: ReleaseUpdate) {
    const rightTags = new Set(right.tags);

    return left.tags.filter((tag) => rightTags.has(tag)).length;
  }

  private getUpdate(updateId: string | undefined) {
    const update = releaseUpdates.find((item) => item.id === updateId) ?? releaseUpdates[0];

    if (!update) {
      throw new Error('Release update mocks are empty');
    }

    return update;
  }

  private toggleValue(values: readonly string[], value: string) {
    return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
  }
}
