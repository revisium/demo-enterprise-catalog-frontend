# Pricing

## Purpose

Show regional price-book rows by server plan, billing term, location, stock, and
effective monthly price.

## Current Data Mode

Prototype typed mock data from the shared catalog snapshot.

## Query Shape

- family and region chips model OR filters inside the selected group;
- term, max price, and stock controls model AND filters;
- sort covers price, stock, setup time, RAM, and last updated time;
- rows flatten plan data plus nested regional availability.
- selected price rows model user-owned runtime state that can be carried into
  quote creation.

## UX Scope

- filter and sort a regional price-book table;
- compare monthly and yearly effective prices without leaving the table;
- select regional rows into a quote draft panel;
- keep selected rows visible while the user adjusts billing term;
- make the next step a quote flow with selected row and billing term prefill.

## Future Contract

Candidate tables: `price_books`, `price_items_compute`, `currencies`,
`regions`, `data_centers`, `discount_rules`, `billing_terms`.
