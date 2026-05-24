# Demo Surface Map

This map keeps the demo from repeating the same proof on every page. Each route
must have one primary customer job and one primary data/platform proof.

| Route                   | Primary customer job                        | Primary demo proof                                      | Avoid duplicating                                      | Future owner                       |
| ----------------------- | ------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------- |
| `/`                     | Guided plan selection                       | Command-center handoff into detail/quote/console path    | Full catalog table, price-book table, account state    | `helio-price`, backend handoff     |
| `/catalog`              | Find a server plan in the full catalog      | AND/OR filters, nested fields, schema/system sorting    | Scenario ranking, quote lifecycle, region item detail  | `helio-price`                      |
| `/catalog/:productId`   | Inspect one plan before quote review        | Specs, add-ons, documents, regional stock, related list | Full catalog discovery, price-book row analysis        | `helio-price`, `helio-cms` docs    |
| `/pricing`              | Validate regional commercial rows           | Price-book filtering, computed savings/efficiency sorts | Plan storytelling, scenario ranking, customer comments | `helio-price`                      |
| `/pricing/:priceBookId` | Inspect one commercial price book           | Item status, computed rows, system-field sorting        | Full catalog browsing, account quote lifecycle         | `helio-price`                      |
| `/locations`            | Choose a region or data-center market       | Regional aggregation, readiness score, stock/setup sort | Product specs, quote form, docs feed                   | `helio-price`                      |
| `/locations/:regionId`  | Inspect one region's plan coverage          | Related plan rows, region alternatives, computed fields | Full catalog browsing, public quote form               | `helio-price`                      |
| `/compare`              | Decide between a small set of plans         | Scenario fit, selected IDs, add-on/support constraints  | Full price-book exploration, region marketplace list   | `helio-price`, backend share links |
| `/resources`            | Find the right customer guide               | CMS article filters, roles, topics, helpful feedback    | News feed, price/stock updates, quote lifecycle        | `helio-cms`, backend preferences   |
| `/resources/:slug`      | Read one guide and choose the next action   | Article template, checklist, related guides             | Feed chronology, catalog table, quote comments         | `helio-cms`, backend preferences   |
| `/releases`             | Track product, docs, price, and region news | CMS update feed, reactions, saved announcements         | Documentation library, server-plan comparison          | `helio-cms`, backend feedback      |
| `/releases/:slug`       | Understand one customer-facing change       | Impact detail, affected paths, related updates          | Article checklist, full price-book exploration         | `helio-cms`, backend feedback      |
| `/quote`                | Prepare a public quote draft                | Form validation, add-ons, estimate, console handoff     | Authenticated comments, organization quote management  | backend runtime                    |
| `/app`                  | Manage user-specific runtime work           | Session user, reference checks, quotes, favorites, audit | Public catalog discovery, public docs browsing         | backend runtime                    |
| `/app/plans/:planId`    | Review one saved server package             | Saved plan detail, related quotes, next actions         | Quote timeline, public pricing table                   | backend runtime                    |
| `/app/quotes/:quoteId`  | Review one account quote                    | Quote timeline, customer comments, related saved plans  | Public quote form, source catalog editing              | backend runtime                    |

## Coverage Rules

- Filter/sort proof should be concentrated in Catalog, Pricing, Locations, and
  Compare, each with a different customer job.
- Quote proof should be split: public quote draft in `/quote`, authenticated
  quote lifecycle in `/app`.
- CMS proof should be split: evergreen docs in `/resources`, dated updates in
  `/releases`, and item-level reading in their detail routes.
- Account runtime proof should be split: signed-in workspace overview in `/app`,
  saved plan detail in `/app/plans/:planId`, and one authenticated quote
  conversation in `/app/quotes/:quoteId`.
- Product Detail is the item page for one plan. It can link to quote, pricing,
  locations, and compare, but should not become any of those pages.
- Public pages must not expose Revisium project names, table names, row IDs,
  mock labels, or source-layer widgets.
- The home page should show the demo path, not a news/update feed. Dated updates
  belong to `/releases`.
