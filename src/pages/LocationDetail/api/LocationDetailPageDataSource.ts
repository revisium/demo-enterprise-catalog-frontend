import { catalogSnapshot } from 'src/entities/catalog';

export class LocationDetailPageDataSource {
  getProducts() {
    return catalogSnapshot.products;
  }
}
