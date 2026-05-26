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
- memory, monthly price, stock, and compliance are always AND constraints;
- region filtering reads nested regional availability rows;
- sorting covers schema fields and system fields such as display order and
  updated time.

## UX Scope

- keep the catalog as the primary high-density browsing surface;
- keep browse cards text-first during density review; decorative product
  visuals belong on detail or later approved asset surfaces;
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
- hide stock and active-filter result metadata when the filtered list is empty;
- treat the default in-stock availability view as a baseline, not a
  user-applied active filter;
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
