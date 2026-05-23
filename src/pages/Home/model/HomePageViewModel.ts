import { makeAutoObservable } from 'mobx';

type BillingTermId = 'monthly' | 'yearly';
type RegionId = 'de-fra' | 'nl-ams' | 'sg-sin' | 'us-nyc';
type ServerPlanId = 'business-vm' | 'database-d4' | 'dedicated-r2' | 'starter-vps' | 'storage-s3';
type UseCaseId = 'database' | 'storage' | 'testing' | 'web-app';

interface UseCaseOption {
  readonly id: UseCaseId;
  readonly label: string;
  readonly summary: string;
}

interface RegionOption {
  readonly id: RegionId;
  readonly label: string;
  readonly availability: string;
}

interface BillingTermOption {
  readonly id: BillingTermId;
  readonly label: string;
  readonly summary: string;
}

interface ServerPlan {
  readonly id: ServerPlanId;
  readonly name: string;
  readonly summary: string;
  readonly cpu: string;
  readonly ram: string;
  readonly storage: string;
  readonly network: string;
  readonly monthlyPrice: string;
  readonly yearlyPrice: string;
  readonly setup: string;
  readonly availability: string;
  readonly regionIds: readonly RegionId[];
  readonly useCaseIds: readonly UseCaseId[];
}

interface UpdateItem {
  readonly label: string;
  readonly summary: string;
}

const useCaseOptions: readonly UseCaseOption[] = [
  {
    id: 'web-app',
    label: 'Website or app',
    summary: 'Public product, admin panel, API, or SaaS backend.',
  },
  {
    id: 'database',
    label: 'Database',
    summary: 'Primary database, analytics store, or high-memory service.',
  },
  {
    id: 'storage',
    label: 'Storage',
    summary: 'Files, backups, media library, or document archive.',
  },
  {
    id: 'testing',
    label: 'Testing',
    summary: 'Short-lived servers for staging, QA, or experiments.',
  },
];

const regionOptions: readonly RegionOption[] = [
  { id: 'de-fra', label: 'Frankfurt', availability: 'many servers ready' },
  { id: 'nl-ams', label: 'Amsterdam', availability: 'ready today' },
  { id: 'us-nyc', label: 'New York', availability: 'limited stock' },
  { id: 'sg-sin', label: 'Singapore', availability: 'pre-order' },
];

const billingTermOptions: readonly BillingTermOption[] = [
  { id: 'monthly', label: 'Monthly', summary: 'No long contract' },
  { id: 'yearly', label: '12 months', summary: 'Lower monthly price' },
];

const serverPlans: readonly ServerPlan[] = [
  {
    id: 'starter-vps',
    name: 'Starter VPS',
    summary: 'Small virtual server for simple apps, test environments, and landing pages.',
    cpu: '2 vCPU',
    ram: '4 GB RAM',
    storage: '80 GB SSD',
    network: '1 Gbps',
    monthlyPrice: '$24/mo',
    yearlyPrice: '$19/mo',
    setup: 'instant setup',
    availability: 'Ready now',
    regionIds: ['de-fra', 'nl-ams', 'us-nyc', 'sg-sin'],
    useCaseIds: ['testing', 'web-app'],
  },
  {
    id: 'business-vm',
    name: 'Business VM',
    summary: 'Balanced virtual server for production apps and medium traffic APIs.',
    cpu: '8 vCPU',
    ram: '32 GB RAM',
    storage: '320 GB NVMe',
    network: '2 Gbps',
    monthlyPrice: '$96/mo',
    yearlyPrice: '$82/mo',
    setup: 'instant setup',
    availability: 'Ready now',
    regionIds: ['de-fra', 'nl-ams', 'us-nyc'],
    useCaseIds: ['database', 'testing', 'web-app'],
  },
  {
    id: 'dedicated-r2',
    name: 'Dedicated R2',
    summary: 'Physical server for steady production workloads and predictable performance.',
    cpu: '16 cores',
    ram: '128 GB RAM',
    storage: '2 x 1.9 TB NVMe',
    network: '10 Gbps',
    monthlyPrice: '$310/mo',
    yearlyPrice: '$265/mo',
    setup: '4 hour setup',
    availability: '3 units left',
    regionIds: ['de-fra', 'nl-ams'],
    useCaseIds: ['database', 'web-app'],
  },
  {
    id: 'database-d4',
    name: 'Database D4',
    summary: 'High-memory server for Postgres, analytics, and critical stateful systems.',
    cpu: '24 cores',
    ram: '256 GB RAM',
    storage: '4 x 3.8 TB NVMe',
    network: '10 Gbps',
    monthlyPrice: '$420/mo',
    yearlyPrice: '$360/mo',
    setup: 'same day setup',
    availability: '2 units left',
    regionIds: ['de-fra', 'us-nyc'],
    useCaseIds: ['database'],
  },
  {
    id: 'storage-s3',
    name: 'Storage S3',
    summary: 'Large storage server for backups, media, and internal file platforms.',
    cpu: '12 cores',
    ram: '64 GB RAM',
    storage: '120 TB HDD + SSD cache',
    network: '10 Gbps',
    monthlyPrice: '$180/mo',
    yearlyPrice: '$149/mo',
    setup: 'same day setup',
    availability: 'Ready today',
    regionIds: ['de-fra', 'nl-ams', 'sg-sin'],
    useCaseIds: ['storage'],
  },
];

const updateItems: readonly UpdateItem[] = [
  {
    label: 'Frankfurt yearly prices changed',
    summary: 'Business VM and Dedicated R2 are cheaper on 12-month contracts.',
  },
  {
    label: 'New Amsterdam stock',
    summary: 'Dedicated servers are available again for same-day orders.',
  },
];

export class HomePageViewModel {
  selectedBillingTermId: BillingTermId = 'monthly';
  selectedRegionId: RegionId = 'de-fra';
  selectedUseCaseId: UseCaseId = 'web-app';
  selectedPlanId: ServerPlanId = 'business-vm';

  constructor() {
    makeAutoObservable(this);
  }

  get useCases() {
    return useCaseOptions;
  }

  get regions() {
    return regionOptions;
  }

  get billingTerms() {
    return billingTermOptions;
  }

  get plans() {
    return serverPlans;
  }

  get updates() {
    return updateItems;
  }

  get selectedUseCase() {
    const useCase = this.useCases.find((item) => item.id === this.selectedUseCaseId);

    if (!useCase) {
      throw new Error('HelioStack catalog requires at least one use case option');
    }

    return useCase;
  }

  get selectedRegion() {
    const region = this.regions.find((item) => item.id === this.selectedRegionId);

    if (!region) {
      throw new Error('HelioStack catalog requires at least one region option');
    }

    return region;
  }

  get selectedBillingTerm() {
    const term = this.billingTerms.find((item) => item.id === this.selectedBillingTermId);

    if (!term) {
      throw new Error('HelioStack catalog requires at least one billing term option');
    }

    return term;
  }

  get selectedPlan() {
    const plan = this.plans.find((item) => item.id === this.selectedPlanId);

    if (!plan) {
      throw new Error('HelioStack catalog requires at least one server plan');
    }

    return plan;
  }

  get matchingPlans() {
    return this.plans.filter(
      (plan) =>
        plan.regionIds.includes(this.selectedRegionId) &&
        plan.useCaseIds.includes(this.selectedUseCaseId),
    );
  }

  get regionPlans() {
    return this.plans.filter((plan) => plan.regionIds.includes(this.selectedRegionId));
  }

  get selectablePlans() {
    if (this.matchingPlans.length > 0) {
      return this.matchingPlans;
    }

    return this.regionPlans;
  }

  get hasExactPlanMatches() {
    return this.matchingPlans.length > 0;
  }

  get selectedPrice() {
    if (this.selectedBillingTermId === 'yearly') {
      return this.selectedPlan.yearlyPrice;
    }

    return this.selectedPlan.monthlyPrice;
  }

  get includedItems() {
    return ['DDoS protection', 'Public IPv4', 'Monitoring', 'Support ticket SLA'];
  }

  selectUseCase(useCaseId: UseCaseId) {
    this.selectedUseCaseId = useCaseId;
    this.selectRecommendedPlan();
  }

  selectRegion(regionId: RegionId) {
    this.selectedRegionId = regionId;
    this.selectRecommendedPlan();
  }

  selectBillingTerm(termId: BillingTermId) {
    this.selectedBillingTermId = termId;
  }

  selectPlan(planId: ServerPlanId) {
    this.selectedPlanId = planId;
  }

  private selectRecommendedPlan() {
    if (
      this.selectedPlan.regionIds.includes(this.selectedRegionId) &&
      this.selectedPlan.useCaseIds.includes(this.selectedUseCaseId)
    ) {
      return;
    }

    const nextPlan = this.matchingPlans[0];

    if (nextPlan) {
      this.selectedPlanId = nextPlan.id;
      return;
    }

    const regionalFallback = this.regionPlans[0];

    if (regionalFallback) {
      this.selectedPlanId = regionalFallback.id;
    }
  }
}
