# Product Detail

## Purpose

Show one server plan with specs, documents, availability, commercial metrics,
quote entry points, related regions, and alternative server plans.

This page is the item inspection surface. It should answer "is this the right
plan?" before the user moves into quote, pricing, compare, or region workflows.

## Current Data Mode

Typed mock product selected from the route parameter.

Unknown product IDs fall back to the first server plan in the snapshot.

## Query Shape

- route parameter selects one `server_plans` item;
- region sort works over nested availability rows;
- in-stock toggle filters regional availability rows;
- alternative plan list ranks related plans by shared regions, price, stock,
  price efficiency, or recent update date;
- related region links point to Location Detail.
- region and alternative rows expose quote links with plan and region prefill.

## Computed Fields

- `totalStock` sums nested regional stock rows;
- `fastestSetupHours` is the minimum setup window across regional rows;
- `priceEfficiencyScore` uses the shared catalog formula;
- regional `readinessScore` uses the same readiness formula as Locations, with
  family coverage fixed at `100` because every row is for the selected plan;
- `priceDelta` compares alternative plan monthly price with the current plan.

## Related Lists

- regions where the selected plan is available;
- alternative plans from the same family or overlapping regions;
- each region links to Location Detail;
- each alternative plan links to Product Detail and quote prefill.

## Future Contract

- Revisium table: `server_plans`.
- Nested object: `server_plans.specs`.
- Arrays: `protocols`, `documents`, `metrics`.
- Related tables: `availability_current`, `regions`, `regional_price_overrides`.
- Files later connect through datasheet, manual, certificate, and render fields.
- Public layout must not show source-layer proof; keep that for the explainer
  surface after backend/Revisium connection.
