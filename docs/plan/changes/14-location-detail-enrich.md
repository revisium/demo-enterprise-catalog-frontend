# 14 — Enrich /locations/:regionId

## Context

The region detail risks being "catalog filtered by region". Give it region-only
data so it is a distinct lens.

## Change

- Add region-specific data: data-center metadata (codes, support window,
  compliance), a stock-history sparkline (from `availability_history_recent`),
  and setup-time facts.
- Keep the related-plans list, but framed as "plans available in {region}" with
  region context, not a full catalog.
- Breadcrumb `Home > Locations > {region}` (per `04`).

## Files

- `src/pages/LocationDetail/*` (page + VM + DataSource)
- `src/entities/pricing` owns stock history (availability is `helio-price`):
  `StockHistoryPoint { date: string; stock: number }` +
  `getRegionStockHistory(regionId): StockHistoryPoint[]` (mock from
  `availability_history_recent`).

## Acceptance

- The page shows data not available on the catalog/region-filter view (DC meta,
  stock history, compliance).
- `npm run verify` green.
