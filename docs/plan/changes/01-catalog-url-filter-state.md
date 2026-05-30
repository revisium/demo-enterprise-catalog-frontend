# 01 — Catalog & pricing filter state in the URL

## Context

Filters/sorts currently live only in ViewModel memory. Three later changes need
them addressable via URL query params: Home guided chips (`10`), scoped hero
cross-links (`05`), and docs.revisium.io deep-links into specific controls.
URL state also makes filtered lists shareable and SSR-correct.

## Change

- Read initial filter/sort state from `location.search` in the Catalog and
  Pricing ViewModels (families, regions, capabilities/add-ons, match mode,
  min RAM, max price, stock-only, sort).
- Push changes back to the URL (replace, not push, to avoid history spam).
- Keep ViewModel as the owner; the URL is the serialization layer only.
- Define a small shared serializer (e.g. `src/shared/routing/filterParams.ts`)
  so Catalog, Pricing, and later Home/Compare share one param vocabulary.

## URL param contract (normative)

| Param | Type | Allowed values | Encoding | Default | Empty/missing |
| --- | --- | --- | --- | --- | --- |
| `family` | enum[] | cloud, dedicated, database, storage, accelerated | comma-separated | — | no family filter |
| `region` | enum[] | fra, ams, nyc, sin | comma-separated | — | all regions |
| `cap` | enum[] | backup, ipv4, monitoring, support, private-vlan, lifecycle-rules | comma-separated | — | no capability filter |
| `match` | enum | all, any | single | all | all |
| `ram` | number | min GB (>= 0) | single | 0 | 0 |
| `price` | number | max USD/mo (>= 0; 0 = no cap) | single | 0 | no cap |
| `stock` | bool | `1` | presence | off | off |
| `sort` | enum | order, updated, price, ram, stock | single | order | order |

Rules: URL wins on load; the ViewModel owns runtime state and writes back via
`replace`. Unknown params are dropped. Invalid enum values fall back to the
listed default. Parse failures fall back to default (ignored, never thrown).

## Files

- `src/pages/Catalog/model/CatalogPageViewModel.ts`
- `src/pages/Pricing/model/PricingPageViewModel.ts`
- `src/pages/Catalog/ui/CatalogPage/CatalogPage.tsx` (wire `useSearchParams`)
- `src/pages/Pricing/ui/PricingPage/PricingPage.tsx`
- new `src/shared/routing/filterParams.ts` (+ export from `src/shared/routing`)

## Acceptance

- Visiting `/catalog?family=cloud,dedicated&match=any&sort=price` pre-applies
  those filters on load (SSR and client).
- Toggling a filter updates the URL; reload preserves the view.
- `npm run verify` green; no React-state-owned business logic in views.
