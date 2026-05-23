import { catalogSnapshot } from 'src/entities/catalog';

export class CatalogPageDataSource {
  getProducts() {
    return catalogSnapshot.products;
  }
}
