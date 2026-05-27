# Compare

## Purpose

Compare products and plans across specs, availability, documents, and limits.

## Current Data Mode

Prototype typed mock data from the shared catalog snapshot.

## UX Scope

- choose up to four plans for the comparison matrix;
- filter compared plans by region, in-stock availability, support tier, and
  required add-ons;
- switch billing term and comparison scenario;
- show price, yearly savings, price efficiency, hardware, setup, support, and
  stock metrics in one scan-friendly table;
- surface the best available quote fit for the selected region and scenario;
- keep the flow connected to quote creation with plan and region prefill.

## Layout Contract

- first screen follows the same premium catalog shell as pricing and locations:
  compact intro, comparison controls spanning two columns, and a right-side
  quote-fit panel;
- comparison controls remain dense and operational, with plan chips, compact
  select controls, billing term, stock mode, add-ons, and active query summary;
- the comparison matrix renders as a true scan-friendly table and uses internal
  horizontal scrolling on mobile instead of collapsing metrics into broken
  stacked rows;
- best-fit rows sit below the matrix with compact secondary columns and a
  right-side quote action aligned to the shared third-column rail;
- public UI must stay buyer-facing and must not expose mock, source-table, or
  internal revision labels.

## Query Shape

- selected plan ids model an explicit `IN` filter;
- region and stock controls model nested availability filters;
- support and add-on controls model AND filters over plan metadata;
- billing term changes the active price projection;
- comparison metrics read schema fields, nested availability, and computed
  values;
- best-fit rows aggregate nested regional stock/setup values and computed fit
  score.

## Future Contract

Catalog data belongs to Revisium. Shareable compare links, if implemented, are
backend-owned runtime state.
