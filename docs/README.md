# Frontend Docs

This directory is the implementation source of truth for the Nexora Systems
frontend.

## Reading Order

1. [`handoff/README.md`](./handoff/README.md)
2. [`product/page-inventory.md`](./product/page-inventory.md)
3. [`product/page-patterns.md`](./product/page-patterns.md)
4. [`design-system/README.md`](./design-system/README.md)
5. [`architecture/frontend.md`](./architecture/frontend.md)
6. [`playbooks/add-page.md`](./playbooks/add-page.md)
7. [`review/frontend-checklist.md`](./review/frontend-checklist.md)

## Source Boundaries

- `../demo-enterprise-catalog-docs` owns the public project passport, public
  architecture summary, and high-level product story.
- This repo owns exact route behavior, UX contracts, mock data contracts,
  responsive expectations, implementation status, design system, and frontend
  review policy.
- Backend and Revisium schemas are intentionally deferred until the first UI
  direction stabilizes.

## Current Development Mode

Use document-first, frontend-first, mock-first development:

1. Specify a page.
2. Implement with typed mock data and ViewModels.
3. Review UI density, layout, responsive behavior, and proof widgets.
4. Stabilize reusable design patterns.
5. Convert mock contracts into Revisium/backend contracts later.
