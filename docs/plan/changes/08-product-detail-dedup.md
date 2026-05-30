# 08 — Product detail dedup (D2, D3, D7)

## Context

Product detail is the most bloated page: price appears 3x, two spec tables, and
a region-sort control that sorts a 3-4 item list.

## Change

- **D2** — remove `Region sort` / `Alternative sort` `SelectField`s from the
  Availability controls card; keep the `In-stock regions` toggle. Drop the
  orphaned `SelectField` import and now-unused VM sort getters
  (`regionSort*`, `alternativeSort*`).
- **D3** — show price once: keep the dark `Commercial summary` panel; remove the
  price tile from the 4-stat `MetricGrid` (`summaryMetrics`), keeping
  stock/setup. (Other stat tiles follow the `02` computed set.)
- **D7** — merge `Technical specs` + `Plan package` into a single spec block
  (one card, grouped rows).

## Files

- `src/pages/ProductDetail/ui/ProductDetailPage/ProductDetailPage.tsx`
- `src/pages/ProductDetail/model/ProductDetailPageViewModel.ts`
  (`summaryMetrics`, merge `technicalRows` + `packageRows`)

## Acceptance

- Price shown exactly once on the page.
- One spec block, no separate "Plan package".
- No region-sort controls; In-stock toggle remains.
- `npm run verify` green.
