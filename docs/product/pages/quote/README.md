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
- Plan and region choices should come from the same typed catalog snapshot during
  the mock-first phase.

## Next UI Decisions

- Required fields.
- Confirmation state.
- How product detail should prefill quote intent after route/query contracts are
  stabilized.
