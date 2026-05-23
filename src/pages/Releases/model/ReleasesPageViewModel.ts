import { makeAutoObservable } from 'mobx';

interface ReleaseUpdate {
  readonly title: string;
  readonly date: string;
  readonly type: 'Catalog' | 'Docs' | 'Pricing' | 'Region';
  readonly summary: string;
  readonly impact: string;
}

const updates: readonly ReleaseUpdate[] = [
  {
    title: 'Singapore storage capacity expanded',
    date: '23 May',
    type: 'Region',
    summary: 'Storage S3 availability increased in SIN-1 with updated setup windows.',
    impact: 'New backup and media workloads can be quoted in APAC.',
  },
  {
    title: 'Q3 price-book draft opened',
    date: '21 May',
    type: 'Pricing',
    summary: 'Yearly contract discounts and reserved dedicated server terms are ready for review.',
    impact: 'Sales can compare current and upcoming commercial terms.',
  },
  {
    title: 'GPU Edge A2 preview stock published',
    date: '20 May',
    type: 'Catalog',
    summary: 'Limited GPU server capacity is visible in Amsterdam and Singapore.',
    impact: 'Customers can request quote review for acceleration projects.',
  },
  {
    title: 'Partner API guide refreshed',
    date: '18 May',
    type: 'Docs',
    summary: 'Availability, price row, and quote lookup examples now share the same terminology.',
    impact: 'Partner integration teams get a clearer onboarding path.',
  },
];

export class ReleasesPageViewModel {
  readonly updates = updates;

  constructor() {
    makeAutoObservable(this);
  }

  get latestUpdate() {
    return this.updates[0];
  }

  get updateCounts() {
    return [
      { label: 'Catalog', value: this.countByType('Catalog') },
      { label: 'Pricing', value: this.countByType('Pricing') },
      { label: 'Docs', value: this.countByType('Docs') },
      { label: 'Regions', value: this.countByType('Region') },
    ];
  }

  private countByType(type: ReleaseUpdate['type']) {
    return this.updates.filter((update) => update.type === type).length;
  }
}
