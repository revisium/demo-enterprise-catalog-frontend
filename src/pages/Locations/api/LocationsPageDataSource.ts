import { catalogSnapshot } from 'src/entities/catalog';

export class LocationsPageDataSource {
  getProducts() {
    return catalogSnapshot.products;
  }
}
