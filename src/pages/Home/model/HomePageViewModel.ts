import { makeAutoObservable } from 'mobx';

import type { CatalogProduct, CatalogRelease } from 'src/entities/catalog';
import { supportedLocales } from 'src/shared/i18n';
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

  readonly companySnapshot = {
    market: 'Industrial telemetry and asset operations',
    customers: 'Manufacturers, utilities, logistics hubs, and equipment service networks',
    operatingModel: 'Global catalog, regional pricing, localized content, and partner enablement',
  };

  constructor() {
    makeAutoObservable(this);
  }

  get heroMetrics(): readonly HeroMetricDescriptor[] {
    return [
      { label: 'featured products', value: this.catalogCardCount },
      { label: 'active update streams', value: this.releaseCount },
      { label: 'official languages planned', value: supportedLocales.length },
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

  get enablementItems() {
    return [
      'Product news and field notes for service teams.',
      'Localized documentation for regional rollout planning.',
      'Partner API coverage and integration readiness.',
      'Price-book updates for procurement and channel teams.',
    ];
  }
}
