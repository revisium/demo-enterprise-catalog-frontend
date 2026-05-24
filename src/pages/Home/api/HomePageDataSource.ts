import { catalogSnapshot } from 'src/entities/catalog';

export type BillingTermId = 'monthly' | 'yearly';
export type RegionId = 'de-fra' | 'nl-ams' | 'sg-sin' | 'us-nyc';
export type ServerPlanId =
  | 'business-vm'
  | 'database-d4'
  | 'dedicated-r2'
  | 'starter-vps'
  | 'storage-s3';
export type UseCaseId = 'database' | 'storage' | 'testing' | 'web-app';

export interface UseCaseOption {
  readonly id: UseCaseId;
  readonly label: string;
  readonly summary: string;
}

export interface RegionOption {
  readonly id: RegionId;
  readonly label: string;
  readonly availability: string;
}

export interface BillingTermOption {
  readonly id: BillingTermId;
  readonly label: string;
  readonly summary: string;
}

export interface ServerPlan {
  readonly id: ServerPlanId;
  readonly catalogProductId: string;
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

export interface JourneyStep {
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
    catalogProductId: 'starter-vps',
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
    catalogProductId: 'business-vm-8',
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
    catalogProductId: 'dedicated-r2',
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
    catalogProductId: 'database-d4',
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
    catalogProductId: 'storage-s3',
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

const includedItems = [
  'DDoS protection',
  'Public IPv4',
  'Monitoring',
  'Support ticket SLA',
] as const;

const journeySteps: readonly JourneyStep[] = [
  {
    label: 'Pick capacity',
    summary: 'Choose a need, data center, and contract term.',
  },
  {
    label: 'Review the plan',
    summary: 'Open specs, documents, stock, and similar plans.',
  },
  {
    label: 'Prepare quote',
    summary: 'Send the selected plan into the public quote request.',
  },
  {
    label: 'Continue in console',
    summary: 'Track saved plans, quote comments, favorites, and preferences.',
  },
];

export class HomePageDataSource {
  getSnapshot() {
    return catalogSnapshot;
  }

  getUseCaseOptions() {
    return useCaseOptions;
  }

  getRegionOptions() {
    return regionOptions;
  }

  getBillingTermOptions() {
    return billingTermOptions;
  }

  getServerPlans() {
    return serverPlans;
  }

  getIncludedItems() {
    return includedItems;
  }

  getJourneySteps() {
    return journeySteps;
  }
}
