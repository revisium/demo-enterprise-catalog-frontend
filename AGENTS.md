# AGENTS.md

Instructions for agents working in `demo-enterprise-catalog-frontend`.

## Read First

1. `docs/handoff/README.md`
2. `REVIEW.md`
3. `docs/README.md`
4. `docs/product/page-inventory.md`
5. `docs/architecture/frontend.md`
6. `../demo-enterprise-catalog-docs/README.md`
7. `../demo-enterprise-catalog-docs/product.md`
8. Reference when needed: `../demo-rpg-frontend`

## Ownership Rules

- This repo owns exact routes, page specs, layout, responsive behavior,
  frontend architecture, and implementation status.
- Do not duplicate full Revisium schemas here. Link to backend-generated
  clients or docs when implementation exists.
- Keep the user experience product-facing: enterprise catalog first, Revisium
  proof second.
- Do not add UGC surfaces such as comments, reviews, public submissions, or
  community feeds.

## UX Rules

- Build the actual catalog experience as the first screen, not a marketing-only
  landing page.
- Current development is frontend-first and mock-first. Do not connect backend
  or Revisium Cloud APIs until the UI contracts are stable enough to preserve.
- Use product images, diagrams, documents, pricing tables, release diff views,
  and source explainer UI.
- Make pricing and catalog screens dense but readable.
- Use the explainer UI only as a secondary inspection layer.

## Implementation Rules

- Use the regular SSR frontend stack from `demo-rpg-frontend`: React Router,
  FSD, MobX ViewModels, DataSources, and `npm run verify`.
- Keep page behavior document-first. Update `docs/product/pages/`,
  `docs/product/page-inventory.md`, design-system docs, or architecture docs in
  the same PR as implementation changes.
- Use typed mock data before backend/Revisium integration.
- Use `@revisium/forms-core` for new non-trivial forms.
- Follow `REVIEW.md`, repo-local `.agents` workflows, GitHub Actions, and Sonar
  zero tolerance before merging.

## Runtime Interactions

Frontend may call backend-owned interactions for:

- saved products;
- request quote;
- document download tracking;
- shareable compare links, if implemented later.

Catalog, pricing, dictionary, CMS, file, and release data should come from
Revisium-backed APIs.
