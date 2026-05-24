import { makeAutoObservable } from 'mobx';

type UpdateAudience = 'Developers' | 'Finance' | 'Operations' | 'Procurement' | 'Sales';
type UpdatePriority = 'Advisory' | 'Important' | 'Routine';
type UpdateSortId = 'latest' | 'most-reacted' | 'priority';
type UpdateType = 'Catalog' | 'Docs' | 'Pricing' | 'Region';

interface ReleaseUpdate {
  readonly audience: UpdateAudience;
  readonly date: string;
  readonly id: string;
  readonly impact: string;
  readonly likedCount: number;
  readonly priority: UpdatePriority;
  readonly summary: string;
  readonly tags: readonly string[];
  readonly title: string;
  readonly type: UpdateType;
}

interface FilterOption {
  readonly id: string;
  readonly label: string;
}

const updates: readonly ReleaseUpdate[] = [
  {
    audience: 'Operations',
    date: '2026-05-23',
    id: 'singapore-storage-capacity-expanded',
    impact: 'New backup and media workloads can be quoted in APAC.',
    likedCount: 18,
    priority: 'Important',
    summary: 'Storage S3 availability increased in SIN-1 with updated setup windows.',
    tags: ['storage', 'apac', 'availability'],
    title: 'Singapore storage capacity expanded',
    type: 'Region',
  },
  {
    audience: 'Finance',
    date: '2026-05-21',
    id: 'q3-price-book-draft-opened',
    impact: 'Sales can compare current and upcoming commercial terms before renewal calls.',
    likedCount: 12,
    priority: 'Important',
    summary: 'Yearly contract discounts and reserved dedicated server terms are ready for review.',
    tags: ['pricing', 'renewal', 'contracts'],
    title: 'Q3 price-book draft opened',
    type: 'Pricing',
  },
  {
    audience: 'Sales',
    date: '2026-05-20',
    id: 'gpu-edge-a2-preview-stock-published',
    impact: 'Customers can request quote review for acceleration projects.',
    likedCount: 9,
    priority: 'Advisory',
    summary: 'Limited GPU server capacity is visible in Amsterdam and Singapore.',
    tags: ['gpu', 'preview', 'stock'],
    title: 'GPU Edge A2 preview stock published',
    type: 'Catalog',
  },
  {
    audience: 'Developers',
    date: '2026-05-18',
    id: 'partner-api-guide-refreshed',
    impact: 'Partner integration teams get a clearer onboarding path.',
    likedCount: 21,
    priority: 'Routine',
    summary: 'Availability, price row, and quote lookup examples now share the same terminology.',
    tags: ['api', 'partners', 'docs'],
    title: 'Partner API guide refreshed',
    type: 'Docs',
  },
  {
    audience: 'Procurement',
    date: '2026-05-17',
    id: 'dedicated-server-sla-note-updated',
    impact: 'Procurement teams can attach clearer support terms to quote approvals.',
    likedCount: 14,
    priority: 'Routine',
    summary: 'Dedicated server SLA language now separates replacement targets from setup windows.',
    tags: ['sla', 'dedicated', 'support'],
    title: 'Dedicated server SLA note updated',
    type: 'Docs',
  },
];

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
  readonly updates = updates;
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

  get latestUpdate() {
    return this.filteredUpdates[0];
  }

  get priorityOptions(): readonly FilterOption[] {
    return this.toOptions(['All', 'Important', 'Advisory', 'Routine']);
  }

  get queryRows() {
    return [
      { label: 'Type', value: this.selectedType },
      { label: 'Audience', value: this.selectedAudience },
      { label: 'Priority', value: this.selectedPriority },
      { label: 'Sort', value: this.getOptionLabel(sortOptions, this.sortId) },
    ];
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

  private getOptionLabel(options: readonly FilterOption[], id: string) {
    return options.find((option) => option.id === id)?.label ?? id;
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
