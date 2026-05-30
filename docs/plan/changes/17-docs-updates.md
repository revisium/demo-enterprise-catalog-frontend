# 17 — Docs updates (same PR per REVIEW.md)

## Context

`docs/` is the implementation source of truth. Any user-visible change must ship
with matching docs in the same PR.

## Change

- `docs/architecture/frontend.md`: add a **Navigation contract** section — two
  axes (breadcrumb = hierarchy/up; labeled back = return to filtered list), the
  breadcrumb trail map, and the cross-link scoping rule (`04`, `05`).
- `docs/product/demo-surface-map.md`: add columns `lens` / `filter class` /
  `sort class` per route; note the quote-cart consolidation and the removal of
  per-page query summaries.
- `docs/product/pages/*`: update specs for every touched page (catalog, pricing,
  pricing-detail, product-detail, locations, location-detail, compare,
  resources, releases, quote, app).
- `docs/product/page-inventory.md`: reflect composition changes (cart, diff,
  timeline, enriched detail routes).
- `docs/design-system/*`: document `Breadcrumbs` and the labeled `BackNavButton`.
- New: a coverage doc mapping capability -> page -> control -> GraphQL stub for
  docs.revisium.io (the explainer replacement).

## Acceptance

- No code change in the PR lacks a matching doc update.
- `npm run markdown:lint` and `npm run verify` green.
