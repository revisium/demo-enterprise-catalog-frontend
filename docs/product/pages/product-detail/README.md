# Product Detail

## Purpose

Show one server plan with specs, documents, availability, commercial metrics,
and quote entry points.

## Current Data Mode

Typed mock product selected from the route parameter.

## Future Contract

- Revisium table: `server_plans`.
- Nested object: `server_plans.specs`.
- Arrays: `protocols`, `documents`, `metrics`.
- Files later connect through datasheet, manual, certificate, and render fields.
- Public layout must not show source-layer proof; keep that for the explainer
  surface after backend/Revisium connection.

## Next UI Decisions

- Detail page information hierarchy.
- Document/download affordance.
