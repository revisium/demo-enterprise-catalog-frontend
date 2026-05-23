import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('app/routes/_index.tsx'),
  route('catalog', 'app/routes/catalog.tsx'),
  route('catalog/:productId', 'app/routes/catalog.$productId.tsx'),
  route('pricing', 'app/routes/pricing.tsx'),
  route('compare', 'app/routes/compare.tsx'),
  route('resources', 'app/routes/resources.tsx'),
  route('releases', 'app/routes/releases.tsx'),
  route('quote', 'app/routes/quote.tsx'),
] satisfies RouteConfig;
