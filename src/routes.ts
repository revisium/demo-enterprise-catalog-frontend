import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('app/routes/_index.tsx'),
  route('catalog', 'app/routes/catalog.tsx'),
  route('catalog/:productId', 'app/routes/catalog.$productId.tsx'),
  route('pricing', 'app/routes/pricing.tsx'),
  route('pricing/:priceBookId', 'app/routes/pricing.$priceBookId.tsx'),
  route('locations', 'app/routes/locations.tsx'),
  route('locations/:regionId', 'app/routes/locations.$regionId.tsx'),
  route('compare', 'app/routes/compare.tsx'),
  route('resources', 'app/routes/resources.tsx'),
  route('resources/:articleId', 'app/routes/resources.$articleId.tsx'),
  route('releases', 'app/routes/releases.tsx'),
  route('releases/:updateId', 'app/routes/releases.$updateId.tsx'),
  route('quote', 'app/routes/quote.tsx'),
  route('auth/demo/refresh', 'app/routes/auth.demo.refresh.tsx'),
  route('app', 'app/routes/app.tsx'),
  route('app/plans/:planId', 'app/routes/app.plans.$planId.tsx'),
  route('app/quotes/:quoteId', 'app/routes/app.quotes.$quoteId.tsx'),
] satisfies RouteConfig;
