# 13 — Releases as a timeline

## Context

`/releases` is a visual clone of `/resources` (filters + featured + saved +
feed). The redundancy is the cloned layout, not the route. The `updates` table
deserves a distinct chronological lens.

## Decision

Date-grouped, impact-first timeline; keep the featured update; drop `Feed mix`.

## Change

- Group updates by date (e.g. month headers) in reverse-chronological order.
- Lead each item with its impact (type/audience/priority) before the body.
- Keep type/audience/priority/date-range filters (timeline-appropriate); drop
  the Resources-style right-rail `Feed mix` block.
- Keep featured + saved updates (backend feedback).
- Link price/region updates to their target (`11` diff, location, catalog).

## Files

- `src/pages/Releases/ui/ReleasesPage/ReleasesPage.tsx`
- `src/pages/Releases/model/ReleasesPageViewModel.ts` (group-by-date)

## Acceptance

- Releases reads as a dated timeline, visually distinct from Resources.
- No `Feed mix` block.
- `npm run verify` green.
