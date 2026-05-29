# Catalog

## Purpose

List product and plan entries with enough filtering structure to evaluate dense
B2B catalog browsing.

## Current Data Mode

Typed mock product records.

## Query Shape

- family, region, add-on, lifecycle, and support tier chips model grouped
  filters;
- `Match all` applies AND across selected groups;
- `Match any` applies OR across selected groups;
- memory, monthly price, stock, and document availability are always AND
  constraints;
- region filtering reads nested regional availability rows;
- sorting covers schema fields and system fields such as display order and
  updated time.

## UX Scope

- keep the catalog as the primary high-density browsing surface;
- keep browse cards text-first during density review, while allowing one
  decorative raster intro visual to distinguish the server catalog section;
- align browse-card content to stable internal columns and use compact `12px`
  card padding;
- let the plan-description and commercial availability columns shrink together
  on tablet-width result cards;
- keep the plan-description column from shrinking below `355px` while the card
  remains in two-column mode;
- show lifecycle badges in the browse-card category row instead of reserving a
  separate status column;
- anchor browse-card action buttons to the lower-right of the commercial
  column;
- keep result counts close to the result heading instead of adding a dashboard
  metric band above the catalog;
- render result counts as separate metadata values so language switching does
  not reuse stale combined count labels;
- show stock and document counts as result-row badges because both can be active
  filter criteria;
- hide stock and active-filter result metadata when the filtered list is empty;
- start stock and document quick filters inactive so first load shows the full
  default catalog;
- show the primary reset action only while filters, sort, match mode, or
  quick-filter state differ from the default query, and hide it after reset;
- make each server result row a clickable item with hover feedback instead of
  rendering a separate `Open` button;
- keep the filter column in document scroll without an internal scrollbar;
- use a wider desktop filter rail with compact `12px` filter-card padding during
  density review;
- start the two-column filter/results catalog layout at the tablet/desktop
  `lg` breakpoint so wide tablets do not show full-width filters above results;
- keep the intro-to-results vertical gap compact so the catalog begins quickly;
- expose query behavior in customer language through the query summary panel;
- let users move from broad exploration to strict shortlist without leaving the
  page;
- keep technical source-layer details in docs, not in the public layout.

## Future Contract

- Revisium project: `enterprise-catalog-data`.
- Candidate tables: `products`, `productFamilies`, `productCategories`,
  `documents`, `regionalAvailability`.
