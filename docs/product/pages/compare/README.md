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
