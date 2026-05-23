export interface CatalogMetric {
  readonly label: string;
  readonly value: string;
}

export interface CatalogProduct {
  readonly id: string;
  readonly name: string;
  readonly family: string;
  readonly category: string;
  readonly summary: string;
  readonly imageAlt: string;
  readonly visualTone: 'gateway' | 'sensor' | 'cloud';
  readonly availability: string;
  readonly regionCount: number;
  readonly lifecycle: string;
  readonly protocols: readonly string[];
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
}

export interface CatalogSnapshot {
  readonly products: readonly CatalogProduct[];
  readonly releases: readonly CatalogRelease[];
}
