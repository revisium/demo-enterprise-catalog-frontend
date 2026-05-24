import { catalogSnapshot, type CatalogProduct } from 'src/entities/catalog';

export class PricingPageDataSource {
  getProducts(): readonly CatalogProduct[] {
    return [...catalogSnapshot.products];
  }
}
