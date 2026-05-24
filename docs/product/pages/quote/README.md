# Quote

## Purpose

Prototype the first backend-owned runtime interaction without connecting a
backend.

## Current Data Mode

`@revisium/forms-core` form with local validation and mock submission state.
The form can be prefilled from query parameters produced by catalog detail,
compare, and pricing screens.

## UX Scope

- capture company and work email with local validation;
- choose plan, region, quantity, billing term, and priority;
- show a live commercial estimate and regional fulfillment fit;
- keep the request reviewable before submission;
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
  plan id, region id, term id, quantity, and priority.
- Plan and region choices should come from the same typed catalog snapshot during
  the mock-first phase.
