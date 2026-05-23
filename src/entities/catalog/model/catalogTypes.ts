export interface CatalogMetric {
  readonly label: string;
  readonly value: string;
}

export interface CatalogSystemFields {
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly revision: number;
  readonly displayOrder: number;
}

export interface CatalogPricing {
  readonly currency: 'USD';
  readonly monthlyUsd: number;
  readonly yearlyMonthlyUsd: number;
  readonly setupUsd: number;
}

export interface CatalogHardware {
  readonly cpuCores: number;
  readonly ramGb: number;
  readonly storageTb: number;
  readonly networkGbps: number;
}

export interface CatalogRegionAvailability {
  readonly regionId: string;
  readonly regionLabel: string;
  readonly dataCenterCode: string;
  readonly stock: number;
  readonly setupHours: number;
  readonly supportWindow: string;
}

export interface CatalogProduct {
  readonly id: string;
  readonly name: string;
  readonly family: string;
  readonly category: string;
  readonly summary: string;
  readonly buyerFit: string;
  readonly customerNote: string;
  readonly imageAlt: string;
  readonly visualTone: 'gateway' | 'sensor' | 'cloud';
  readonly availability: string;
  readonly regionCount: number;
  readonly lifecycle: string;
  readonly protocols: readonly string[];
  readonly addons: readonly string[];
  readonly billingTerms: readonly string[];
  readonly compliance: readonly string[];
  readonly supportTier: 'Business' | 'Enterprise' | 'Standard';
  readonly system: CatalogSystemFields;
  readonly pricing: CatalogPricing;
  readonly hardware: CatalogHardware;
  readonly availabilityByRegion: readonly CatalogRegionAvailability[];
  readonly specs: {
    readonly enclosure: string;
    readonly ingress: string;
    readonly operatingRange: string;
    readonly connectivity: string;
  };
  readonly documents: readonly string[];
  readonly metrics: readonly CatalogMetric[];
}

export interface CatalogRelease {
  readonly id: string;
  readonly label: string;
  readonly summary: string;
  readonly scope: string;
}

export interface CatalogSnapshot {
  readonly products: readonly CatalogProduct[];
  readonly releases: readonly CatalogRelease[];
}
