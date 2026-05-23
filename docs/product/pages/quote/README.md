# Quote

## Purpose

Prototype the first backend-owned runtime interaction without connecting a
backend.

## Current Data Mode

`@revisium/forms-core` form with local validation and mock submission state.

## Future Contract

- Backend owns quote submissions.
- Revisium does not own submitted user intent.
- Form values should become the candidate mutation input.

## Next UI Decisions

- Required fields.
- Confirmation state.
- Whether quote starts from a product detail page or standalone route.
