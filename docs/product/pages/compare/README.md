# Compare

## Purpose

Compare products and plans across specs, availability, documents, and limits.

## Current Data Mode

Prototype typed mock data from the shared catalog snapshot.

## UX Scope

- choose up to four plans for the comparison matrix;
- filter compared plans by region and in-stock availability;
- show price, hardware, setup, and stock metrics in one scan-friendly table;
- surface the best available quote fit for the selected region;
- keep the flow connected to quote creation without exposing internal source
  layer details.

## Query Shape

- selected plan ids model an explicit `IN` filter;
- region and stock controls model nested availability filters;
- comparison metrics read both schema fields and system freshness fields from
  catalog items;
- best-fit rows aggregate nested regional stock and setup values.

## Future Contract

Catalog data belongs to Revisium. Shareable compare links, if implemented, are
backend-owned runtime state.
