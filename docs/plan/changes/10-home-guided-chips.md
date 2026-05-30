# 10 — Home guided chips -> deep-links (D4)

## Context

Home's left "command center" column duplicates catalog facets and filters in
place. Home should be an entry point, not a mini-catalog.

Depends on `01-catalog-url-filter-state`.

## Change

- Convert Need / Data center / Contract from in-place filters to **guided chips
  that deep-link** into `/catalog?need=...&region=...&term=...`. Show a matching
  plan count only if it is already present in the Home snapshot; otherwise render
  the chip without a count (no live query, no in-place filtering).
- Remove the in-place filtering logic and the `CompactQuerySummary` block.
- Keep the hero (featured/recommended plan) and "Choose another server"; the
  primary action is `Browse catalog` / a single `Add to quote` per `03`.
- "Recommended server" is fine as a featured plan; label it `Featured` rather
  than implying personalization.

## Files

- `src/pages/Home/ui/HomePage/HomePage.tsx`
- `src/pages/Home/ui/CompactQuerySummary/CompactQuerySummary.tsx` (remove)
- `src/pages/Home/model/HomePageViewModel.ts` (drop in-place filter state;
  expose deep-link hrefs)

## Acceptance

- Home chips navigate to `/catalog` with the matching filters pre-applied.
- No in-place filtering or query-summary on Home.
- `npm run verify` green.
