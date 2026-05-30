# 05 — Scope hero cross-section links (N3)

## Context

Product detail hero buttons link to bare sections (`to="/locations"`,
`"/compare"`, `"/pricing"`), dumping the user into the whole section without the
current plan. Cross-links should carry context.

Depends on `01-catalog-url-filter-state` (URL params) and `03-quote-cart`.

## Change

- `View regions` -> `/locations/:regionId` (path param `regionId`, slug,
  e.g. `frankfurt`) for this plan's primary region.
- `Compare plans` -> `/compare?plans=<planId>` (`plans` = comma-separated
  planIds; preselect this plan).
- `Pricing` -> `/pricing?family=<family>` (`family` = single family id, allowed
  values per `01`).
- Replace the hero `Request quote` with `Add to quote` (cart) per `03`.
- Apply the same scoping to other cross-links that currently drop context.

## Files

- `src/pages/ProductDetail/ui/ProductDetailPage/ProductDetailPage.tsx`
- `src/pages/ProductDetail/model/ProductDetailPageViewModel.ts` (expose scoped
  hrefs: `regionsHref`, `compareHref`, `pricingHref`)
- `src/pages/Compare/model/*` (read preselected `plans` from URL)

## Acceptance

- `View regions` / `Compare plans` / `Pricing` land scoped to the plan.
- Compare opens with the plan preselected.
- `npm run verify` green.
