import { makeAutoObservable } from 'mobx';

import {
  releaseUpdates,
  type ReleaseUpdate,
  type UpdatePriority,
  type UpdateType,
} from 'src/entities/content';

type UpdateSortId = 'latest' | 'most-reacted' | 'priority';

interface FilterOption {
  readonly id: string;
  readonly label: string;
}

const priorityRank: Record<UpdatePriority, number> = {
  Important: 3,
  Advisory: 2,
  Routine: 1,
};

const sortOptions: readonly FilterOption[] = [
  { id: 'latest', label: 'Latest first' },
  { id: 'priority', label: 'Highest priority' },
  { id: 'most-reacted', label: 'Most reacted' },
];

export class ReleasesPageViewModel {
  readonly updates = releaseUpdates;
  likedUpdateIds: readonly string[] = [];
  savedUpdateIds: readonly string[] = ['q3-price-book-draft-opened'];
  selectedAudience = 'All';
  selectedPriority = 'All';
  selectedType = 'All';
  sortId: UpdateSortId = 'latest';

  constructor() {
    makeAutoObservable(this);
  }

  get audienceOptions(): readonly FilterOption[] {
    return this.toOptions(['All', ...new Set(this.updates.map((update) => update.audience))]);
  }

  get filteredUpdates() {
    return [...this.updates.filter((update) => this.matchesUpdate(update))].sort((left, right) =>
      this.compareUpdates(left, right),
    );
  }

  get hasNoMatches() {
    return this.filteredUpdates.length === 0;
  }

  get hasUserFilters() {
    return (
      this.selectedAudience !== 'All' ||
      this.selectedPriority !== 'All' ||
      this.selectedType !== 'All' ||
      this.sortId !== 'latest'
    );
  }

  get latestUpdate() {
    return this.filteredUpdates[0];
  }

  get priorityOptions(): readonly FilterOption[] {
    return this.toOptions(['All', 'Important', 'Advisory', 'Routine']);
  }
  get savedUpdates() {
    return this.updates.filter((update) => this.savedUpdateIds.includes(update.id));
  }

  get sortOptions() {
    return sortOptions;
  }

  get summaryMetrics() {
    return [
      { label: 'Updates', value: String(this.updates.length) },
      { label: 'Important', value: String(this.countByPriority('Important')) },
      { label: 'Reactions', value: String(this.totalLikedCount) },
      { label: 'Saved', value: String(this.savedUpdates.length) },
    ];
  }

  get typeOptions(): readonly FilterOption[] {
    return this.toOptions(['All', 'Catalog', 'Docs', 'Pricing', 'Region']);
  }

  get updateCounts() {
    return [
      { label: 'Catalog', value: this.countByType('Catalog') },
      { label: 'Pricing', value: this.countByType('Pricing') },
      { label: 'Docs', value: this.countByType('Docs') },
      { label: 'Regions', value: this.countByType('Region') },
    ];
  }

  getLikedCount(update: ReleaseUpdate) {
    return update.likedCount + (this.isLiked(update.id) ? 1 : 0);
  }

  getRelatedUpdates(updateId: string | undefined) {
    const update = this.getUpdate(updateId);

    return this.updates
      .filter((candidate) => candidate.id !== update.id)
      .map((candidate) => ({
        score: this.getSharedTagCount(update, candidate) + Number(candidate.type === update.type),
        update: candidate,
      }))
      .sort(
        (left, right) =>
          right.score - left.score || Date.parse(right.update.date) - Date.parse(left.update.date),
      )
      .slice(0, 3)
      .map((candidate) => candidate.update);
  }

  getUpdate(updateId: string | undefined) {
    const update = this.updates.find((item) => item.id === updateId) ?? this.updates[0];

    if (!update) {
      throw new Error('Release update mocks are empty');
    }

    return update;
  }

  isLiked(updateId: string) {
    return this.likedUpdateIds.includes(updateId);
  }

  isSaved(updateId: string) {
    return this.savedUpdateIds.includes(updateId);
  }

  resetFilters() {
    this.selectedAudience = 'All';
    this.selectedPriority = 'All';
    this.selectedType = 'All';
    this.sortId = 'latest';
  }

  selectAudience(audience: string) {
    this.selectedAudience = this.hasOption(this.audienceOptions, audience) ? audience : 'All';
  }

  selectPriority(priority: string) {
    this.selectedPriority = this.hasOption(this.priorityOptions, priority) ? priority : 'All';
  }

  selectSort(sortId: string) {
    this.sortId = this.hasOption(sortOptions, sortId) ? (sortId as UpdateSortId) : 'latest';
  }

  selectType(type: string) {
    this.selectedType = this.hasOption(this.typeOptions, type) ? type : 'All';
  }

  toggleLike(updateId: string) {
    this.likedUpdateIds = this.toggleValue(this.likedUpdateIds, updateId);
  }

  toggleSaved(updateId: string) {
    this.savedUpdateIds = this.toggleValue(this.savedUpdateIds, updateId);
  }

  private compareUpdates(left: ReleaseUpdate, right: ReleaseUpdate) {
    if (this.sortId === 'priority') {
      return priorityRank[right.priority] - priorityRank[left.priority];
    }

    if (this.sortId === 'most-reacted') {
      return this.getLikedCount(right) - this.getLikedCount(left);
    }

    return Date.parse(right.date) - Date.parse(left.date);
  }

  private countByPriority(priority: UpdatePriority) {
    return this.updates.filter((update) => update.priority === priority).length;
  }

  private countByType(type: UpdateType) {
    return this.updates.filter((update) => update.type === type).length;
  }

  private get totalLikedCount() {
    return (
      this.updates.reduce((total, update) => total + update.likedCount, 0) +
      this.likedUpdateIds.length
    );
  }
  private getSharedTagCount(left: ReleaseUpdate, right: ReleaseUpdate) {
    const rightTags = new Set(right.tags);

    return left.tags.filter((tag) => rightTags.has(tag)).length;
  }

  private hasOption(options: readonly FilterOption[], id: string) {
    return options.some((option) => option.id === id);
  }

  private matchesUpdate(update: ReleaseUpdate) {
    const matchesType = this.selectedType === 'All' || update.type === this.selectedType;
    const matchesAudience =
      this.selectedAudience === 'All' || update.audience === this.selectedAudience;
    const matchesPriority =
      this.selectedPriority === 'All' || update.priority === this.selectedPriority;

    return matchesType && matchesAudience && matchesPriority;
  }

  private toOptions(values: readonly string[]): readonly FilterOption[] {
    return values.map((value) => ({ id: value, label: value }));
  }

  private toggleValue(values: readonly string[], value: string) {
    return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
  }
}
