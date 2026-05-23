# Nexora Systems Company Legend

## Positioning

Nexora Systems is a mid-market industrial technology vendor for manufacturers,
utilities, logistics hubs, and equipment service networks. The company sells
edge devices, wireless condition-monitoring sensors, SaaS monitoring plans, and
partner APIs that help asset-heavy customers collect machine telemetry, govern
field documentation, and publish region-specific commercial catalogs.

The public site should feel like a real procurement and enablement portal:
buyers compare devices, service teams download manuals and certificates,
partners inspect API/dictionary coverage, and product operations teams publish
catalog and price-book updates with auditable revision evidence.

## Products

- **Industrial edge gateways** collect plant-floor telemetry, translate
  protocols, and forward events to cloud systems.
- **Condition-monitoring sensors** track vibration and temperature for rotating
  equipment programs.
- **Observe SaaS plans** provide fleet dashboards, alert routing, retention
  tiers, partner APIs, and export workflows.
- **Enablement content** includes datasheets, installation manuals,
  certifications, regional availability notes, solution pages, and release
  announcements.

## Buyer Context

Primary users are operations leaders, reliability engineers, procurement teams,
system integrators, and partner success managers. They care about availability,
regional pricing, lead time, compliance documents, protocol support, supported
languages, and whether a published catalog can be traced back to controlled
source data.

## Revisium Demo Role

The demo should make Revisium visible through proof, not through marketing copy.
The catalog experience comes first; Revisium appears as the source layer behind
published data:

- CMS pages and news posts come from a localized content project.
- Product and document dictionaries expose stable IDs and linked rows.
- Price books expose currencies, regions, tiers, and revision diffs.
- Backend runtime features use those dictionaries but do not become source of
  truth for catalog data.

## Future Revisium Projects

- `enterprise-catalog-cms`: localized pages, blog/news posts, solution pages,
  authors, tags, SEO metadata, and media references.
- `enterprise-catalog-data`: products, families, categories, protocols,
  documents, certifications, regional availability, and source links.
- `enterprise-catalog-price`: price books, currencies, regions, tiers, bundle
  items, release states, and diff evidence.

## Runtime Features

Backend-owned features should demonstrate Revisium as a dictionary service and
content/price source:

- quote requests;
- saved products;
- product likes or interest signals;
- region/currency/language dictionaries;
- availability lookup;
- partner API examples.

Runtime data must never overwrite catalog, CMS, or price source data.

## Public UX Rule

Public pages must look like a real Nexora Systems product and enablement site.
They should not expose detailed Revisium mechanics, mock-state labels, backend
wiring notes, source-layer widgets, project names, table names, row IDs, or
implementation proof panels.

Revisium details belong in docs, developer/partner documentation, future
internal proof views, PR descriptions, and engineering handoff material. The
customer-facing UI should show business outcomes: products, availability,
documentation, releases, pricing context, partner readiness, and localized
content.
