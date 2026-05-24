# Quote

## Purpose

Prototype the customer-facing quote workspace before connecting runtime
submission APIs.

## Current Data Mode

`@revisium/forms-core` form with local validation and mock submission state.
The form can be prefilled from query parameters produced by catalog detail,
compare, and pricing screens. Catalog choices are read through a page data
source so the later API adapter can replace the typed mock without changing the
UI contract.

## UX Scope

- capture company and work email with local validation;
- choose plan, region, quantity, billing term, priority, and service options;
- show a live commercial estimate, yearly savings, regional stock fit, and
  request readiness checklist;
- keep the request reviewable before submission;
- show the expected review path from draft to sales review and customer
  approval;
- show a local confirmation state without connecting to a backend.

## Query Shape

- `plan` accepts a catalog product id;
- `region` accepts a regional availability id;
- `term` accepts a billing term id;
- the quote form resolves ids into customer-facing labels during the mock-first
  phase.

## Future Contract

- Backend owns quote submissions.
- Revisium does not own submitted user intent.
- Form values should become the candidate mutation input, including selected
  plan id, region id, term id, quantity, priority, and selected add-ons.
- Plan and region choices should come from the same typed catalog snapshot during
  the mock-first phase.
- Quote review status, comments, approvals, and follow-up actions belong to the
  authenticated backend workspace.
