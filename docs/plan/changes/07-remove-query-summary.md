# 07 — Remove all "Query summary" surfaces (D1)

## Context

A "Query summary" inspector repeats on 9 surfaces, restating the user's filter
selections. It is the biggest source of cross-page deja-vu and is unnecessary
(the explainer is not built; natural results headers already exist).

## Change

Remove every "Query summary" surface (verified clean in a trial pass):

| Page | Mechanism | Removal |
| --- | --- | --- |
| Catalog | shared `QuerySummary` | drop the line + import |
| Pricing | inline two-column block | drop the whole `<Box>` row |
| Locations | `QuerySummary` inside Active-view card | drop the line (keep MetricGrid) |
| Resources | `QuerySummary` | drop the line + import |
| Releases | `QuerySummary` | drop the line + import |
| Compare | `QuerySummary` | drop the line + import |
| Product detail | `DetailRowsCard title="Query summary"` | drop the card |
| Pricing detail | `QuerySummary` in Book-status card | drop the line + import |
| Location detail | `QuerySummary` is the card's only content | drop the whole card |

- Rely on the existing results line (`Matches · Stock · Active filters`, etc.).
- Remove now-dead VM getters: `queryRows` (each VM), Pricing
  `firstSummaryColumn` / `secondSummaryColumn`.
- Remove the now-unused `QuerySummary` component/export from
  `src/shared/ui/QueryControls/QueryControls.tsx` and `src/shared/ui/index.ts`.

## Acceptance

- A `src/`-wide scan returns nothing: `grep -rn "QuerySummary\|Query summary" src/`
  (the component/export is removed, not just its usages).
- No empty cards/gaps left behind.
- `npm run verify` green.
