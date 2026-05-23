import { catalogSnapshot } from 'src/entities/catalog';

export class PricingPageDataSource {
  getProducts() {
    return catalogSnapshot.products;
  }
}
