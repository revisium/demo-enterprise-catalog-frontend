# 11 — Pricing book diff (/pricing/:bookId)

## Context

Versioning is the strongest, unique (temporal) lens and is currently buried.
Rebuild the price-book detail as a **book-vs-book diff**.

## Decision

Axis: **book vs book** (e.g. `2026 Q2 (Active)` vs `Q3 contract draft`).

## Change

- Header: book name, status, effective window; a `Compare to ▾` picker for the
  other book.
- Summary band: `12 prices changed · +3 plans · -1 region · avg +4.2%`.
- Diff table: rows = price items, columns `A | B | Δ`. Added = green,
  removed = red, changed = amber with `old -> new` and `Δ%`.
- Filters scoped to the diff: `only changed`, by family, by region, by term.
- Cross-link: a `price updated {date}` badge on catalog/pricing rows links here.
- Mock data: add a second book that genuinely differs from the first.

## States (normative)

- Invalid/unknown `bookId` -> "Book not found" with a link back to `/pricing`.
- No second comparable book -> empty state, CTA "Select another book".
- Same book chosen as the compare target -> that option is disabled in the picker.
- Diff result states: success (table), empty-diff ("No changes"), error (retry).

## Files

- `src/pages/PricingDetail/*` (page + VM + DataSource)
- `src/entities/pricing/mocks/priceBookSnapshot.ts` (two comparable books)
- `src/pages/Catalog/*`, `src/pages/Pricing/*` (the `price updated` badge link)

## Acceptance

- `/pricing/:bookId` shows an A/B/Δ diff with color-coded changes and a working
  `only changed` filter.
- The summary band counts added/removed/changed correctly.
- Invalid `bookId`, no-comparable-book, and same-book-selected render the
  defined states above.
- `npm run verify` green.
