import { catalogSnapshot, type CatalogProduct } from 'src/entities/catalog';

export class ComparePageDataSource {
  getProducts(): readonly CatalogProduct[] {
    return [...catalogSnapshot.products];
  }
}
