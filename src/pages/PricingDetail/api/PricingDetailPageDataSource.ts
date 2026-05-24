import { catalogSnapshot, type CatalogProduct } from 'src/entities/catalog';
import { priceBooks, type PriceBook } from 'src/entities/pricing';

export class PricingDetailPageDataSource {
  getPriceBooks(): readonly PriceBook[] {
    return priceBooks;
  }

  getProducts(): readonly CatalogProduct[] {
    return catalogSnapshot.products;
  }
}
