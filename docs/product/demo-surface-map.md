# Demo Surface Map

This map keeps the demo from repeating the same proof on every page. Each route
must have one primary customer job and one primary data/platform proof.

| Route                  | Primary customer job                        | Primary demo proof                                      | Avoid duplicating                                      | Future owner                       |
| ---------------------- | ------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------- |
| `/`                    | Guided plan selection                       | Command-center handoff into quote/detail/price/compare  | Full catalog table, price-book table, account state    | `helio-price`, backend handoff     |
| `/catalog`             | Find a server plan in the full catalog      | AND/OR filters, nested fields, schema/system sorting    | Scenario ranking, quote lifecycle, region item detail  | `helio-price`                      |
| `/catalog/:productId`  | Inspect one plan before quote review        | Specs, add-ons, documents, regional stock, related list | Full catalog discovery, price-book row analysis        | `helio-price`, `helio-cms` docs    |
| `/pricing`             | Validate regional commercial rows           | Price-book filtering, computed savings/efficiency sorts | Plan storytelling, scenario ranking, customer comments | `helio-price`                      |
| `/locations`           | Choose a region or data-center market       | Regional aggregation, readiness score, stock/setup sort | Product specs, quote form, docs feed                   | `helio-price`                      |
| `/locations/:regionId` | Inspect one region's plan coverage          | Related plan rows, region alternatives, computed fields | Full catalog browsing, public quote form               | `helio-price`                      |
| `/compare`             | Decide between a small set of plans         | Scenario fit, selected IDs, add-on/support constraints  | Full price-book exploration, region marketplace list   | `helio-price`, backend share links |
| `/resources`           | Read and save customer documentation        | CMS article filters, roles, topics, helpful feedback    | News feed, price/stock updates, quote lifecycle        | `helio-cms`, backend preferences   |
| `/releases`            | Track product, docs, price, and region news | CMS update feed, reactions, saved announcements         | Documentation library, server-plan comparison          | `helio-cms`, backend feedback      |
| `/quote`               | Prepare a public quote draft                | Form validation, add-ons, estimate, readiness checklist | Authenticated comments, organization quote management  | backend runtime                    |
| `/app`                 | Manage organization-specific runtime work   | Quotes, saved plans, favorites, API keys, audit trail   | Public catalog discovery, public docs browsing         | backend runtime                    |

## Coverage Rules

- Filter/sort proof should be concentrated in Catalog, Pricing, Locations, and
  Compare, each with a different customer job.
- Quote proof should be split: public quote draft in `/quote`, authenticated
  quote lifecycle in `/app`.
- CMS proof should be split: evergreen docs in `/resources`, dated updates in
  `/releases`.
- Product Detail is the item page for one plan. It can link to quote, pricing,
  locations, and compare, but should not become any of those pages.
- Public pages must not expose Revisium project names, table names, row IDs,
  mock labels, or source-layer widgets.
