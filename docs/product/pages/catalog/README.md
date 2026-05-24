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
- expose query behavior in customer language through the query summary panel;
- let users move from broad exploration to strict shortlist without leaving the
  page;
- keep technical source-layer details in docs, not in the public layout.

## Future Contract

- Revisium project: `enterprise-catalog-data`.
- Candidate tables: `products`, `productFamilies`, `productCategories`,
  `documents`, `regionalAvailability`.
