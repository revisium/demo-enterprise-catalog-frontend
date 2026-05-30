# 03 — Quote cart (header badge + /quote review)

## Context

Quote-building is scattered across 5 surfaces (Home Send/Reserve, Product detail
Request quote + per-region `Quote here`, Pricing `Quote draft`, Compare tray).
Consolidate into one classic cart.

## Decision

- Header shows a cart indicator `Quote · N` (item count). **No drawer** — the
  badge navigates to the full `/quote` page showing the selected list.
- Items expose `Add to quote` (with `Added` state) on: catalog cards, product
  detail, pricing rows, compare columns.
- `/quote` reads the cart, lists plan + region + term + add-ons per line,
  shows the commercial review, and submits with one verb: `Request quote`.

## Change

- Cart store as a feature/entity (e.g. `src/features/quoteCart/*`) holding line
  items `{ planId, regionId, termId, addonIds[] }`; MobX, **in-memory only for
  the mock phase (cleared on reload)** (later: backend runtime mutation).
- Header (`AppLayout`) renders the badge from cart count.
- Replace bespoke builders: remove Pricing `Quote draft` accumulator (D5),
  Compare quote-fit "Request quote" becomes `Add to quote` + cart, Home
  `Send/Reserve` become `Add to quote` / `View plan`.
- `/quote` ViewModel sources lines from the cart instead of single-plan prefill.

## Files

- new `src/features/quoteCart/*`
- `src/app/layouts/AppLayout/AppLayout.tsx` (badge)
- `src/pages/Quote/*`, `src/pages/Pricing/*`, `src/pages/Compare/*`,
  `src/pages/Catalog/*`, `src/pages/ProductDetail/*`, `src/pages/Home/*`
- i18n: `quote.add`, `quote.added`, `quote.badge`, `quote.request` (6 locales)

## Acceptance

- Adding from catalog/detail/pricing/compare increments the header badge.
- `/quote` lists all added lines; `Request quote` is the only submit verb.
- Pricing `Quote draft` block is gone; no duplicate quote builders remain.
- Reload clears the cart (in-memory only) and the badge resets to `0`.
- `npm run verify` green.
