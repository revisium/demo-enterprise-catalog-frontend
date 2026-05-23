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

## Future Contract

Candidate tables: `price_books`, `price_items_compute`, `currencies`,
`regions`, `data_centers`, `discount_rules`, `billing_terms`.
