import { catalogSnapshot, type CatalogProduct } from 'src/entities/catalog';

export class ProductDetailPageDataSource {
  private readonly products: readonly CatalogProduct[] = [...catalogSnapshot.products];

  getProduct(productId: string | undefined): CatalogProduct {
    const product = this.products.find((item) => item.id === productId) ?? this.products[0];

    if (!product) {
      throw new Error('Product catalog snapshot is empty');
    }

    return product;
  }

  getProducts(): readonly CatalogProduct[] {
    return this.products;
  }
}
