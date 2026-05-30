# 15 — Enrich /app/plans/:id

## Context

The saved-plan detail is close to a copy of product detail + runtime status.
Give it a distinct record lens so it earns its route.

## Change

- Add `related quotes` (quotes that reference this saved plan) and a
  `plan change history` (runtime audit of edits to the saved configuration).
- Keep package/next-actions, but lead with what is account-specific.
- Breadcrumb `Home > Console > Saved plans > {plan}` (per `04`).

## Contract & states (normative)

- `relatedQuotes: { id: string; status: 'DRAFT'|'SENT'|'ACCEPTED'|'REJECTED'; updatedAt: string (ISO 8601); reference: string }[]`
  sorted by `updatedAt` desc.
- `changeHistory: { id: string; timestamp: string (ISO 8601); actor: { id: string; name: string }; summary: string }[]`
  sorted by `timestamp` desc.
- UI states: loading (skeleton), empty ("No related quotes yet" / "No changes
  yet"), error with retry. Retry re-fetches both lists; partial-data (one list
  fails) renders the available list with a non-blocking error banner for the
  failed one. No automatic retries — one manual retry on click.
- Responsive: two columns on `lg` and above, stacked on `base`.
- Mock fixtures in `CustomerPortalPageDataSource.getRelatedQuotes(planId)` and
  `CustomerPortalPageDataSource.getPlanChangeHistory(planId)`.

## Files

- `src/pages/PortalSavedPlanDetail/*` (page + VM)
- `src/pages/CustomerPortal/api/CustomerPortalPageDataSource.ts` or a portal
  entity (related quotes + change history mocks)

## Acceptance

- The page shows related quotes + change history not present on product detail.
- `npm run verify` green.
