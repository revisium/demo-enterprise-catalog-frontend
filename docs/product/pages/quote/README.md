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
- make the next authenticated step explicit: quote follow-up, comments, saved
  plans, favorites, and preferences continue in `/app`;
- show a local confirmation state without connecting to a backend.

## Layout Contract

- Keep the public quote form as the primary work surface.
- On desktop, use the shared three-column rail: form content spans the first two
  columns, while request preview, commercial review, readiness, regional fit,
  review path, and next-step cards share the right column.
- Use one compact dark card for the live request preview.
- On mobile, stack the form and rail cards without squeezing individual form
  controls below readable widths.

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
- The quote page may link to the console, but it must not duplicate console
  quote timelines or authenticated comments.
