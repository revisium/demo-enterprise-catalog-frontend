import { makeAutoObservable } from 'mobx';

interface ReleaseUpdate {
  readonly title: string;
  readonly date: string;
  readonly audience: 'Developers' | 'Finance' | 'Operations' | 'Sales';
  readonly likedCount: number;
  readonly type: 'Catalog' | 'Docs' | 'Pricing' | 'Region';
  readonly summary: string;
  readonly impact: string;
}

const updates: readonly ReleaseUpdate[] = [
  {
    title: 'Singapore storage capacity expanded',
    date: '23 May',
    audience: 'Operations',
    likedCount: 18,
    type: 'Region',
    summary: 'Storage S3 availability increased in SIN-1 with updated setup windows.',
    impact: 'New backup and media workloads can be quoted in APAC.',
  },
  {
    title: 'Q3 price-book draft opened',
    date: '21 May',
    audience: 'Finance',
    likedCount: 12,
    type: 'Pricing',
    summary: 'Yearly contract discounts and reserved dedicated server terms are ready for review.',
    impact: 'Sales can compare current and upcoming commercial terms.',
  },
  {
    title: 'GPU Edge A2 preview stock published',
    date: '20 May',
    audience: 'Sales',
    likedCount: 9,
    type: 'Catalog',
    summary: 'Limited GPU server capacity is visible in Amsterdam and Singapore.',
    impact: 'Customers can request quote review for acceleration projects.',
  },
  {
    title: 'Partner API guide refreshed',
    date: '18 May',
    audience: 'Developers',
    likedCount: 21,
    type: 'Docs',
    summary: 'Availability, price row, and quote lookup examples now share the same terminology.',
    impact: 'Partner integration teams get a clearer onboarding path.',
  },
];

export class ReleasesPageViewModel {
  readonly updates = updates;
  likedUpdateTitles: readonly string[] = [];
  selectedType: ReleaseUpdate['type'] | 'All' = 'All';

  constructor() {
    makeAutoObservable(this);
  }

  get latestUpdate() {
    return this.filteredUpdates[0];
  }

  get typeOptions(): readonly (ReleaseUpdate['type'] | 'All')[] {
    return ['All', 'Catalog', 'Docs', 'Pricing', 'Region'];
  }

  get updateCounts() {
    return [
      { label: 'Catalog', value: this.countByType('Catalog') },
      { label: 'Pricing', value: this.countByType('Pricing') },
      { label: 'Docs', value: this.countByType('Docs') },
      { label: 'Regions', value: this.countByType('Region') },
    ];
  }

  get filteredUpdates() {
    if (this.selectedType === 'All') {
      return this.updates;
    }

    return this.updates.filter((update) => update.type === this.selectedType);
  }

  get summaryMetrics() {
    return [
      { label: 'Updates', value: String(this.updates.length) },
      { label: 'Types', value: String(this.updateCounts.filter((item) => item.value > 0).length) },
      { label: 'Reactions', value: String(this.totalLikedCount) },
    ];
  }

  selectType(type: ReleaseUpdate['type'] | 'All') {
    this.selectedType = this.typeOptions.includes(type) ? type : 'All';
  }

  toggleLike(title: string) {
    this.likedUpdateTitles = this.likedUpdateTitles.includes(title)
      ? this.likedUpdateTitles.filter((item) => item !== title)
      : [...this.likedUpdateTitles, title];
  }

  isLiked(title: string) {
    return this.likedUpdateTitles.includes(title);
  }

  getLikedCount(update: ReleaseUpdate) {
    return update.likedCount + (this.isLiked(update.title) ? 1 : 0);
  }

  private countByType(type: ReleaseUpdate['type']) {
    return this.updates.filter((update) => update.type === type).length;
  }

  private get totalLikedCount() {
    return (
      this.updates.reduce((total, update) => total + update.likedCount, 0) +
      this.likedUpdateTitles.length
    );
  }
}
