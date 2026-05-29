# Product Detail

## Purpose

Show one server plan with specs, documents, availability, commercial metrics,
quote entry points, related regions, and alternative server plans.

This page is the item inspection surface. It should answer "is this the right
plan?" before the user moves into quote, pricing, compare, or region workflows.
The hero should avoid generic navigation duplicates that already exist in the
global menu unless the target can carry the selected plan context.

## Current Data Mode

Typed mock product selected from the route parameter.

Unknown product IDs fall back to the first server plan in the snapshot.

## Query Shape

- route parameter selects one `server_plans` item;
- region sort works over nested availability rows;
- in-stock toggle filters regional availability rows;
- alternative plan list ranks related plans by shared regions, price, stock,
  price efficiency, or recent update date;
- list controls are presented as separate regional availability and alternative
  plan work cards instead of generic "controls" copy;
- work card labels, counts, and sort options use explicit interface
  translations so non-English locales do not receive mixed-language phrases;
- related region links point to Location Detail.
- region and alternative rows expose quote links with plan and region prefill;
- alternative plan cards navigate to plan detail from the whole card while
  keeping quote as a separate explicit action.
- hero quote is the only primary action; compare and locations remain global
  navigation until those pages accept a selected-plan deep link.

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
- plan resources render add-on and document references as resource rows with
  varied semantic markers and target badges, not pill buttons, tag-like badges,
  or trailing arrow-only affordances;
- plan resource text uses explicit interface translations for every supported
  language instead of relying on visual phrase replacement;
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
