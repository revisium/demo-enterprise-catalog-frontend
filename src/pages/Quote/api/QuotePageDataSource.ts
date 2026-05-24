import { catalogSnapshot, type CatalogProduct } from 'src/entities/catalog';

export class QuotePageDataSource {
  getProducts(): readonly CatalogProduct[] {
    return [...catalogSnapshot.products];
  }
}
