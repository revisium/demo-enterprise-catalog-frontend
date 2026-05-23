import { makeAutoObservable } from 'mobx';

import type { CatalogProduct, CatalogRelease } from 'src/entities/catalog';
import { HomePageDataSource } from '../api/HomePageDataSource';

interface HeroMetricDescriptor {
  readonly label: string;
  readonly value: number;
}

type HomeCatalogCard = CatalogProduct & {
  readonly detailHref: string;
  readonly previewMetrics: CatalogProduct['metrics'];
  readonly previewProtocols: CatalogProduct['protocols'];
};

export class HomePageViewModel {
  private readonly dataSource = new HomePageDataSource();

  readonly backendCallCount = 0;

  constructor() {
    makeAutoObservable(this);
  }

  get heroMetrics(): readonly HeroMetricDescriptor[] {
    return [
      { label: 'priority product cards', value: this.catalogCardCount },
      { label: 'release states', value: this.releaseCount },
      { label: 'backend calls in this PR', value: this.backendCallCount },
    ];
  }

  get heroProducts(): readonly HomeCatalogCard[] {
    return this.dataSource
      .getSnapshot()
      .products.slice(0, 3)
      .map((product) => ({
        ...product,
        detailHref: `/catalog/${product.id}`,
        previewMetrics: product.metrics.slice(0, 2),
        previewProtocols: product.protocols.slice(0, 3),
      }));
  }

  get releases(): readonly CatalogRelease[] {
    return this.dataSource.getSnapshot().releases;
  }

  get catalogCardCount() {
    return this.heroProducts.length;
  }

  get releaseCount() {
    return this.releases.length;
  }

  get proofItems() {
    return [
      'Future project: enterprise-catalog-data.',
      'Candidate tables: products, documents, catalogReleases.',
      'Nested specs, protocol arrays, document arrays, and release states are already represented.',
    ];
  }
}
