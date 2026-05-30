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
- Page specs (`docs/product/pages/<page>/README.md`), one per touched page —
  update each, creating the ones marked (new):
  - `catalog/README.md`, `pricing/README.md`, `pricing-detail/README.md` (new),
    `product-detail/README.md`, `locations/README.md`,
    `location-detail/README.md`, `compare/README.md`, `resources/README.md`,
    `releases/README.md`, `quote/README.md`, `app/README.md`, `home/README.md`.
  - Each must carry: purpose, route(s), controls, states/transitions, data
    contract, responsive behavior, acceptance criteria.
- `docs/product/page-inventory.md`: reflect composition changes (cart, diff,
  timeline, enriched detail routes).
- `docs/design-system/README.md`: document the `Breadcrumbs` component and the
  labeled `BackNavButton`.
- New coverage doc `docs/product/revisium-coverage.md` mapping
  capability -> page -> control -> GraphQL stub (the docs.revisium.io source),
  with columns `capability | page | control | graphql-stub` and an example row.

## Acceptance

- No code change in the PR lacks a matching doc update.
- `npm run markdown:lint` and `npm run verify` green.
