import { catalogSnapshot, type CatalogProduct } from 'src/entities/catalog';

export class ProductDetailPageDataSource {
  getProduct(productId: string | undefined): CatalogProduct {
    const product =
      catalogSnapshot.products.find((item) => item.id === productId) ??
      catalogSnapshot.products[0];

    if (!product) {
      throw new Error('Product catalog mock snapshot is empty');
    }

    return product;
  }
}
