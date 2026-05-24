import { useParams } from 'react-router';

import { ProductDetailPage } from 'src/pages/ProductDetail';

export default function ProductDetailRoute() {
  const params = useParams();

  return <ProductDetailPage key={params.productId ?? 'catalog-fallback'} />;
}
