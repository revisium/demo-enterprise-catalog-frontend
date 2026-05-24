# Product Routes

This folder owns the frontend route and UX contract for the HelioStack demo.

HelioStack is a cloud and dedicated server catalog with regional price books and
an authorized customer portal. The public site helps visitors choose servers,
compare prices, read docs, and request quotes. The private portal handles saved
plans, quote lifecycle, favorites, audit history, and organization settings.

Read [`company.md`](./company.md) before adding major pages. It defines the
company legend, buyer context, and source-data boundaries that keep the demo
realistic.

Use [`demo-surface-map.md`](./demo-surface-map.md) when adding or polishing
pages. It defines each route's unique demo role so the prototype does not repeat
the same interaction under different labels.

## Route Map

| Route                     | Purpose                                                     | Main source                                       |
| ------------------------- | ----------------------------------------------------------- | ------------------------------------------------- |
| `/`                       | Server-plan picker and first price recommendation           | price catalog + CMS labels                        |
| `/catalog`                | Server listing with filters                                 | `helio-price`                                     |
| `/catalog/[productId]`    | Server detail, specs, regions, add-ons, SLA                 | `helio-price` + CMS                               |
| `/pricing`                | Price books, currencies, contract terms, setup fees         | `helio-price`                                     |
| `/pricing/[priceBookId]`  | Price-book detail and revision-aware rows                   | `helio-price`                                     |
| `/locations`              | Data-center list, region availability, support windows      | `helio-price` + CMS                               |
| `/locations/[slug]`       | Data-center detail page                                     | `helio-price` + CMS                               |
| `/compare`                | Server-plan comparison                                      | `helio-price` + backend for saved/shareable state |
| `/resources`              | Docs, SLA notes, billing rules, networking guides, API docs | `helio-cms`                                       |
| `/resources/[slug]`       | Documentation article detail                                | `helio-cms`                                       |
| `/updates` or `/releases` | Stock, docs, and price-book updates                         | `helio-cms` + `helio-price`                       |
| `/releases/[slug]`        | Product update detail and affected workspaces               | `helio-cms` + `helio-price`                       |
| `/quote`                  | Public quote request flow                                   | backend runtime                                   |
| `/app`                    | Authorized customer dashboard                               | backend runtime                                   |
| `/app/plans`              | Saved server plans                                          | backend runtime                                   |
| `/app/plans/[planId]`     | Saved server plan detail                                    | backend runtime                                   |
| `/app/quotes`             | Quote requests and statuses                                 | backend runtime                                   |
| `/app/quotes/[quoteId]`   | Quote details, comments, status history                     | backend runtime                                   |
| `/app/favorites`          | Favorite servers, locations, docs                           | backend runtime                                   |
| `/app/organization`       | Organization profile, users, billing profile                | backend runtime                                   |

## First Slice

Prototype and stabilize this before expanding:

1. `/`
2. `/catalog`
3. `/catalog/[productId]`
4. `/pricing`
5. `/locations`
6. `/quote`
7. `/app`

Detailed source-layer proof should stay out of the public first slice.

## Content Source Plan

- `helio-cms`: docs, updates, page copy, FAQ, navigation, localized strings,
  authors, tags, SEO metadata, and glossary/dictionary labels.
- `helio-price`: server plans, hardware profiles, data centers, regions,
  currencies, price books, price items, availability, add-ons, discounts, and
  SLA tiers.
- Backend DB: users, organizations, saved plans, quote requests, comments,
  favorites, likes/helpful votes, and audit trail.

## Page Expectations

- Public pages should read as a real cloud server catalog. Do not expose
  detailed Revisium mechanics, mock-state labels, backend wiring notes,
  source-layer widgets, project names, table names, row IDs, or implementation
  proof panels in customer-facing layout.
- Home should stay a working selector, not a marketing landing page.
- Product detail should show nested technical specs, regions, add-ons, SLA, and
  pricing availability.
- Pricing pages should show price books, contract terms, currencies, regions,
  setup fees, and computed effective prices.
- Docs and updates should show the CMS value without becoming the first screen of
  the demo.
- Quote, favorites, and saved-plan flows are runtime interactions; they must not
  become the source of catalog truth.

## Explainer Evidence

For each data-backed page, expose only evidence that is real and belongs outside
the customer-facing layout:

- GraphQL request and variables;
- sample response;
- project/table/row links;
- computed fields and source fields;
- linked rows;
- file fields;
- revision or diff link when relevant;
- REST/MCP equivalents where available.
