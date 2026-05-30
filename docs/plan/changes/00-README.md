# Change prompts — nav & cleanup program

Each file in this folder is a self-contained implementation prompt: context,
what to change, files to touch, and acceptance criteria. Execute one at a time.
All product decisions are locked (below). No item is deferred.

## Locked decisions

| Topic | Decision |
| --- | --- |
| In-app explainer | **Not built.** Capability -> Revisium-feature mapping lives on docs.revisium.io. |
| Quote flow | **Classic cart.** Header badge `Quote · N`; `Add to quote` on items; badge opens the full `/quote` page (no drawer) with the selected list; submit `Request quote`. Replaces Home/Detail/Pricing-draft/Compare builders. |
| Computed metrics | Replace `efficiency`/`score`/`readiness`/`fit` with a typed computed set: `$/core`, `$/GB` (number), `Regions in stock` (array aggregate), `Instant setup` + `Available everywhere` (boolean), `Value tier` Economy/Balanced/Performance (string/enum), `Top regions` (array). |
| Pricing diff | `/pricing/:bookId` = **book vs book** diff (Q2 Active vs Q3 Draft): added/removed/changed rows, delta %, `only changed` filter. |
| Releases | Keep route, rebuild as **date-grouped, impact-first timeline**; keep featured update; drop `Feed mix`. |
| `/locations/:regionId` | **Enrich**: data-center metadata, stock-history sparkline, setup/compliance. Not a filtered catalog. |
| `/app/plans/:id` | **Enrich**: related quotes + plan change history. |
| Canonical names | `Servers` / `Updates` / `Console`. Keep routes; align titles/eyebrows/breadcrumbs to the menu words. |
| D3 price | Keep dark Commercial summary; drop the price tile from the stat-card row. |
| D4 Home | Need/DataCenter/Contract become guided chips that **deep-link** into `/catalog?...`. |

## Principles

- A page earns its place only as a unique pair **(lens x table)**.
- A block earns its place only if it does work no neighbour does.
- Filters/sorts follow the page lens; no global filter template on every page.

## Execution order (dependencies)

1. `01-catalog-url-filter-state` — foundation for 05, 10, and docs deep-links.
2. `02-computed-fields-model` — foundation for 08, 11, 12.
3. `03-quote-cart` — foundation for 05, 08, 10, 13.
4. Navigation: `04-navigation-breadcrumbs-back`, `05-scope-cross-links`,
   `06-canonical-names`.
5. Cleanups: `07-remove-query-summary`, `08-product-detail-dedup`,
   `09-console-cleanup`, `10-home-guided-chips`.
6. Structural: `11-pricing-book-diff`, `12-pricing-matrix-grid`,
   `13-releases-timeline`, `14-location-detail-enrich`,
   `15-saved-plan-detail-enrich`, `16-data-volume`.
7. `17-docs-updates` (same PR as the code per `REVIEW.md`).

## Global acceptance

- `npm run verify` is green after every prompt.
- i18n strings added in all 6 locales (`src/shared/i18n/messages.ts`).
- No new page-specific CSS; Chakra primitives/tokens only (per `REVIEW.md`).
- Matching docs updated (see `17-docs-updates`).
