# 16 — Scale mock data so controls aren't decorative

## Context

The catalog has ~6 plans under a heavy filter apparatus; AND/OR and pagination
do not "play". A real catalog is non-uniform.

## Change

- Grow `server_plans` mock to ~25-40 plans across 5 families with varied
  hardware, price, stock, and region coverage so filters meaningfully narrow
  results and some combinations return few/zero.
- Grow price items accordingly so the matrix (`12`) and diff (`11`) are
  substantive.
- Keep tables typed and contract-shaped (DataSource-owned), per `REVIEW.md`.

## Files

- `src/entities/catalog/mocks/catalogSnapshot.ts`
- `src/entities/pricing/mocks/priceBookSnapshot.ts`

## Acceptance

- Toggling catalog filters visibly changes result counts (incl. empty states).
- `npm run verify` green.
