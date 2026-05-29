# Pricing

## Purpose

Show active regional price rows by server plan, billing term, location, stock,
and effective monthly price, while keeping versioned price books visually
separate from those rows.

## Current Data Mode

Prototype typed mock data from the shared catalog snapshot.

## Query Shape

- family and region chips model OR filters inside the selected group;
- add-on chips can match any selected add-on or require all selected add-ons;
- term, max price, stock, minimum RAM, max setup time, and support-window
  controls model AND filters;
- sort covers effective price, computed price efficiency, computed yearly
  savings, stock, setup time, RAM, catalog display order, and last updated time;
- active rows flatten plan data plus nested regional availability into one
  `server plan + region + billing term` price row;
- price books are versioned commercial sources such as the active regional book
  and upcoming draft contract book;
- selected price rows model user-owned runtime state that can be carried into
  quote creation.

## UX Scope

- filter and sort a regional price-book table;
- label the main table as active regional price rows, not as a generic nested
  price-book list;
- use a compact decorative raster intro image to make pricing visually distinct
  from catalog and comparison pages without changing the dense workflow;
- open `/pricing/:priceBookId` to inspect one price book, its status, and its
  active regional rows;
- label the right rail as price-book versions so users can distinguish source
  books from selectable quote rows;
- make price-book list items clickable with hover feedback instead of rendering
  a separate `Open` button;
- compare monthly and yearly effective prices without leaving the table;
- inspect the active query summary in customer language;
- select regional rows into a quote draft panel;
- keep selected rows visible while the user adjusts billing term;
- show the primary reset action only while filters, row selections, billing
  term, sort, or availability view differ from the default query, and hide it
  after reset;
- keep filter cards and nested select controls constrained to their grid column
  so translated labels and long option text do not create horizontal page
  scroll;
- stack regional max price, max setup, and sort controls vertically inside the
  pricing filter card;
- keep those stacked regional select controls visually compact from tablet
  widths while the filter card spans the page, then restore full width when the
  filter card returns to the narrow third column;
- apply the same compact-width behavior to single select controls in the
  commercial and server-filter cards, such as add-on matching and minimum
  memory;
- keep regional price rows in a constrained column card layout across desktop,
  tablet, and mobile, with local horizontal scrolling on narrow mobile widths
  instead of allowing the full page to overflow;
- reserve two-line height for the server description under each row title on
  desktop so price-row cards keep a consistent rhythm;
- align the price-book version side column to the same third-column width as
  the regional price-row filter card above it;
- make the next step a quote flow with selected row and billing term prefill.
- keep the first pricing filter section in one column on mobile and tablet
  breakpoints (up to `991px`), use a two-column layout on `lg` (`992px`+), and
  move to three columns on `xl` (`1280px`+);
- extract query-summary content from the filter card into a separate summary card on
  desktop, placing that card under all three filter columns at `xl`+, while all
  four cards stack vertically on mobile and tablet.
- keep `/pricing/:priceBookId` close to the pricing overview for regional row
  cards, right-column alignment, and price-book version naming, while preserving
  the older detail-page combined filter block and placing the query summary
  inside book status.

## Future Contract

Candidate tables: `price_books`, `price_items_compute`, `currencies`,
`regions`, `data_centers`, `discount_rules`, `billing_terms`.

The price-book detail route keeps computed price efficiency and yearly savings
available as sort/filter inputs, while also allowing system-field sorting such
as source revision and update time.
