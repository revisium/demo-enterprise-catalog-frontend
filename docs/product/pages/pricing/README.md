# Pricing

## Purpose

Show regional price-book rows by server plan, billing term, location, stock, and
effective monthly price.

## Current Data Mode

Prototype typed mock data from the shared catalog snapshot.

## Query Shape

- family and region chips model OR filters inside the selected group;
- add-on chips can match any selected add-on or require all selected add-ons;
- term, max price, stock, minimum RAM, max setup time, and support-window
  controls model AND filters;
- sort covers effective price, computed price efficiency, computed yearly
  savings, stock, setup time, RAM, catalog display order, and last updated time;
- rows flatten plan data plus nested regional availability;
- selected price rows model user-owned runtime state that can be carried into
  quote creation.

## UX Scope

- filter and sort a regional price-book table;
- open `/pricing/:priceBookId` to inspect one price book, its status, and its
  active regional rows;
- compare monthly and yearly effective prices without leaving the table;
- inspect the active query summary in customer language;
- select regional rows into a quote draft panel;
- keep selected rows visible while the user adjusts billing term;
- make the next step a quote flow with selected row and billing term prefill.

## Future Contract

Candidate tables: `price_books`, `price_items_compute`, `currencies`,
`regions`, `data_centers`, `discount_rules`, `billing_terms`.

The price-book detail route keeps computed price efficiency and yearly savings
available as sort/filter inputs, while also allowing system-field sorting such
as source revision and update time.
