# 16 — Scale mock data so controls aren't decorative

## Context

The catalog has ~6 plans under a heavy filter apparatus; AND/OR and pagination
do not "play". A real catalog is non-uniform.

## Change

- Grow `server_plans` mock to **>= 30 plans**: at least 5 per family across the
  5 families; each of the 4 regions covered by >= 8 plans; >= 3 plans
  out-of-stock. Spread price/RAM so sorts reorder visibly.
- Grow price items accordingly so the matrix (`12`) and diff (`11`) are
  substantive.
- Keep tables typed and contract-shaped (DataSource-owned), per `REVIEW.md`.

## Files

- `src/entities/catalog/mocks/catalogSnapshot.ts`
- `src/entities/pricing/mocks/priceBookSnapshot.ts`

## Acceptance

- Toggling catalog filters visibly changes result counts (incl. empty states).
- At least 2 documented filter combinations return 0 results and at least 1
  returns exactly 1 result (named in the spec as fixtures).
- `npm run verify` green.
