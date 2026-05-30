# 12 — Pricing rows as a plan x region grid

## Context

`/pricing` currently stacks identical rows (`Starter VPS` repeated per region),
which reads as filler. The pivot lens should look like a matrix, not a list.

## Change

- Render the price rows as a grid: plan rows x region (or term) columns, with the
  effective price in each cell. Repetition becomes an axis = data, not padding.
- Keep the computed columns from `02` (`$/core`, `valueTier`) as row metadata.
- `Add to quote` (`03`) acts per cell/row.

## Files

- `src/pages/Pricing/ui/PricingPage/PricingPage.tsx`
- `src/pages/Pricing/model/PricingPageViewModel.ts` (shape rows into a matrix)

## Acceptance

- Same plan across regions reads as one row with region columns, not N stacked
  cards.
- `npm run verify` green.
