# Revisium Data Plan

HelioStack uses two Revisium projects plus a backend database. Revisium owns
versioned catalog, price, CMS, and dictionary data. Backend owns authorized user
state and runtime business logic.

## Table Volume Rule

Keep every Revisium table below `10 000` rows for the demo. If a dataset grows
larger, split it by purpose, lifecycle, or revision window instead of creating a
single oversized table.

## Project: `helio-cms`

Content, localization, docs, updates, and UI dictionary values.

| Table               | Approx rows | Purpose                                                  |
| ------------------- | ----------: | -------------------------------------------------------- |
| `pages`             |      40-120 | Managed CMS pages and route-level content blocks         |
| `navigation_items`  |      40-120 | Header, footer, docs, and portal navigation labels       |
| `docs_articles`     |     200-600 | Customer docs for networking, backups, billing, SLA, API |
| `docs_categories`   |       20-80 | Documentation section tree                               |
| `updates`           |     100-300 | Stock, price, location, and docs announcements           |
| `faq_items`         |     100-300 | Support and sales FAQ                                    |
| `authors`           |       20-80 | Docs/news authors and support team profiles              |
| `tags`              |     100-300 | Docs, updates, location, and product labels              |
| `glossary_terms`    |     200-800 | Dictionary service demo for UI/help terminology          |
| `localized_strings` | 2 000-8 000 | UN-language-ready UI strings and short labels            |
| `media_assets`      |     100-700 | Image/file metadata, alt text, and usage hints           |
| `seo_metadata`      |     100-500 | Titles, descriptions, canonical metadata                 |

## Project: `helio-price`

Server catalog, hardware specs, regions, prices, stock, add-ons, and SLA data.

| Table                         | Approx rows | Purpose                                                |
| ----------------------------- | ----------: | ------------------------------------------------------ |
| `server_plans`                |   300-2 000 | Public plans: VPS, dedicated, database, storage        |
| `hardware_profiles`           |   500-3 000 | CPU, RAM, disk, network, chassis, vendor families      |
| `plan_hardware_links`         | 1 000-6 000 | Plan-to-hardware mapping                               |
| `regions`                     |       20-80 | Commercial regions                                     |
| `data_centers`                |      30-150 | Physical locations and support metadata                |
| `currencies`                  |       20-80 | Currency dictionary                                    |
| `billing_terms`               |       10-50 | Monthly, yearly, reserved, trial, setup billing labels |
| `price_books`                 |     100-500 | Versioned commercial price books                       |
| `price_items_compute`         | 4 000-9 000 | Compute plan prices by region, currency, term          |
| `price_items_storage`         | 2 000-7 000 | Storage and backup prices                              |
| `price_items_addons`          | 1 000-6 000 | IPv4, backup, monitoring, bandwidth, support add-ons   |
| `availability_current`        | 2 000-8 000 | Current stock and setup timing by plan/location        |
| `availability_history_recent` | 5 000-9 000 | Recent stock snapshots for charts and demos            |
| `addons`                      |     100-700 | Add-on catalog                                         |
| `sla_tiers`                   |      20-120 | Support/SLA packages                                   |
| `discount_rules`              |   300-3 000 | Contract, region, volume, and partner discounts        |

## Backend-Owned Runtime Data

These do not live in Revisium because they are user-specific or transactional:

| Area                | Purpose                                                |
| ------------------- | ------------------------------------------------------ |
| Users and auth      | login, sessions, identity provider links               |
| Organizations       | company profile, members, roles, billing profile       |
| Saved plans         | per-user saved server configurations                   |
| Quote requests      | draft/submitted/approved/rejected/expired lifecycle    |
| Quote comments      | authenticated conversation on quote details            |
| Favorites           | saved servers, locations, docs, and updates            |
| Likes/helpful votes | docs/update feedback and dictionary-service demo hooks |
| Audit trail         | runtime actions and compliance history                 |

## Backend Session And Dictionary Validation

The demo frontend models automatic authorization as a backend-owned refresh
step. On page entry, the server route performs a demo session refresh and sets
`HttpOnly` cookies such as `helio_session` and `helio_demo_fingerprint`. The
refresh response is not a user-profile API for browser JavaScript and does not
carry a readable identity body. Later page loads and mutations send cookies
automatically, and backend handlers resolve the current user server-side before
returning authenticated page data or accepting writes.

The prototype also exposes `/auth/demo/refresh` as the future refresh endpoint
shape. It returns no user payload; it only refreshes cookies. The real backend
can replace this route with a signed JWT/session-cookie implementation without
changing the portal contract.

The customer console also exposes mock mutation routes that already follow the
future backend boundary:

| Route                           | Runtime write modeled                  |
| ------------------------------- | -------------------------------------- |
| `/app/actions/preferences`      | user language/currency/region defaults |
| `/app/actions/favorites`        | user saved-plan favorite               |
| `/app/actions/quote-comments`   | quote conversation note                |
| `/app/actions/content-feedback` | saved/helpful docs or update feedback  |

Runtime mutations store backend-owned data only after checking referenced IDs
against Revisium dictionaries and source rows:

| Runtime input | Revisium validation before persistence             |
| ------------- | -------------------------------------------------- |
| `languageId`  | active language and localized label set            |
| `currencyId`  | active currency allowed for the organization       |
| `regionId`    | active commercial region and availability window   |
| `planId`      | active server plan, lifecycle, and regional access |
| `statusId`    | allowed quote status and transition                |
| `roleId`      | active role allowed to perform the action          |
| `docId`       | published article before helpful/save feedback     |
| `updateId`    | published update before like/save feedback         |

Backend rows should store stable source IDs and, where needed, source revision
metadata. Backend must not copy catalog, CMS, or price dictionaries into runtime
tables as editable truth.

## Demo Value

- `helio-cms` proves Revisium as CMS and dictionary service.
- `helio-price` proves Revisium as versioned catalog and price-book source.
- Backend proves authorized workflows, mutations, and business lifecycle around
  the stable Revisium source data.

## Query Coverage

The frontend prototype should prove these query shapes through natural customer
controls. Do not show Revisium project names, table names, row IDs, or source
widgets inside the public layout.

| UI area   | Customer control                                                            | Future query capability                         |
| --------- | --------------------------------------------------------------------------- | ----------------------------------------------- |
| Catalog   | Match all filters                                                           | `AND` over family, stock, price, docs, hardware |
| Catalog   | Match any selected family/region/add-on                                     | `OR` groups over selected values                |
| Catalog   | Memory and price filters                                                    | Nested schema fields: `hardware`, `pricing`     |
| Catalog   | Region and stock filters                                                    | Array/nested availability fields                |
| Catalog   | Catalog order and recently updated sorts                                    | System fields: display order and updated time   |
| Catalog   | Price, RAM, and stock sorts                                                 | Schema-field sorting and computed totals        |
| Pricing   | Term, family, region, add-on, support, stock, max price                     | Price-item filtering with joined plan metadata  |
| Pricing   | RAM and setup controls                                                      | Nested plan and regional availability fields    |
| Pricing   | Price, efficiency, savings, stock, setup, RAM, display-order, updated sorts | Mixed schema, nested, computed, and system sort |
| Compare   | Selected plans, region, support, required add-ons, billing term             | Explicit IDs plus nested and metadata filters   |
| Compare   | Scenario ranking and fit score                                              | Computed comparison fields from catalog/price   |
| Quote     | Plan, region, term, quantity, priority, selected add-ons                    | Runtime mutation shaped by catalog identifiers  |
| Quote     | Readiness checklist, commercial estimate, and review path                   | Backend lifecycle over stable catalog inputs    |
| Resources | Category, role, topic, and read-time controls                               | CMS article, author, category, and tag filters  |
| Resources | Helpful votes and saved reads                                               | Backend-owned user feedback and preferences     |
| Releases  | Type, audience, priority, and reaction sorts                                | CMS update feed with tags and customer impact   |
| Releases  | Likes and saved announcements                                               | Backend-owned user feedback and preferences     |
| Locations | Family, support window, stock filters                                       | Nested availability rows grouped by region      |
| Locations | Setup, plan count, stock, updated sorts                                     | Aggregated fields plus related system metadata  |

These controls are mock-backed now. The page ViewModels should remain the
contract sketch for later Revisium GraphQL variables and backend API adapters.
