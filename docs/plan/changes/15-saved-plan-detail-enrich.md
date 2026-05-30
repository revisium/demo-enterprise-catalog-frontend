# 15 — Enrich /app/plans/:id

## Context

The saved-plan detail is close to a copy of product detail + runtime status.
Give it a distinct record lens so it earns its route.

## Change

- Add `related quotes` (quotes that reference this saved plan) and a
  `plan change history` (runtime audit of edits to the saved configuration).
- Keep package/next-actions, but lead with what is account-specific.
- Breadcrumb `Home > Console > Saved plans > {plan}` (per `04`).

## Files

- `src/pages/PortalSavedPlanDetail/*` (page + VM)
- `src/pages/CustomerPortal/api/CustomerPortalPageDataSource.ts` or a portal
  entity (related quotes + change history mocks)

## Acceptance

- The page shows related quotes + change history not present on product detail.
- `npm run verify` green.
