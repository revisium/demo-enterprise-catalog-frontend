import { catalogSnapshot, type CatalogProduct } from 'src/entities/catalog';

export class QuotePageDataSource {
  private readonly products: readonly CatalogProduct[] = [...catalogSnapshot.products];

  getProducts(): readonly CatalogProduct[] {
    return this.products;
  }
}
