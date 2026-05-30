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
- These exact filter combinations must hold after the mock is written:
  - `family=accelerated & stock=1` → 0 results (no accelerated servers in stock).
  - `family=storage & region=nyc & stock=1` → 0 results (no NYC storage in stock).
  - `family=database & region=fra & ram=256` → exactly 1 result.
- `npm run verify` green.
