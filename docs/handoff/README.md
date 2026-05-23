# Handoff

## Current Stage

Stage 1 is frontend-first bootstrap. The goal is to create several convincing
catalog pages with typed mock data before connecting backend or Revisium
projects.

## First PR Scope

- React Router SSR stack.
- Local verification and CI.
- Local Sonar scripts compatible with the frontend bootstrap stage.
- Review contract and bot-facing instructions.
- Page contracts for the first UI slice.
- Mock data layer for catalog home, catalog list, product detail, and quote.
- `@revisium/forms-core` usage for the first runtime interaction form.

## Next PRs

1. Review the first home/catalog/product-detail UI direction.
2. Stabilize responsive behavior and any visual changes from review.
3. Build pricing and release-diff pages on mock data.
4. Expand resources/documents and compare flows.
5. Freeze contracts for Revisium tables, generated clients, and backend runtime
   interactions.

## Required Handoff Output

Every implementation handoff should include:

- changed pages and docs;
- validation commands;
- UI review notes for desktop/tablet/mobile;
- open contract questions;
- PR, CI, Sonar, and unresolved review-thread status.
