# HelioStack Company Legend

## Positioning

HelioStack is a premium cloud and dedicated server provider for small and
mid-market engineering teams. The company sells VPS plans, dedicated servers,
database servers, storage servers, regional availability, add-ons, SLA tiers,
and customer support around a versioned commercial catalog.

The public site should feel like a real server purchasing and enablement portal:
buyers compare plans, developers read docs, finance teams inspect contract
terms, and customer admins manage saved plans and quote requests in the portal.

## Products

- **Cloud servers** for websites, SaaS backends, APIs, staging, and testing.
- **Dedicated servers** for predictable production workloads.
- **Database servers** with high-memory hardware profiles.
- **Storage servers** for backups, media, file platforms, and archives.
- **Add-ons** include public IPv4, backups, monitoring, bandwidth, and support
  tiers.
- **Enablement content** includes networking guides, backup docs, billing rules,
  SLA notes, API docs, FAQ, and price/stock updates.

## Buyer Context

Primary users are startup founders, engineering leads, DevOps engineers,
procurement teams, agencies, and partner integrators. They care about price,
region, setup time, available stock, technical specs, contract terms, docs, SLA,
and whether the published price can be traced back to controlled source data.

## Revisium Demo Role

The demo should make Revisium visible through proof, not through marketing copy.
The catalog experience comes first; Revisium appears as the source layer behind
published data:

- CMS pages, docs, updates, and dictionary labels come from `helio-cms`.
- Server plans, hardware specs, data centers, prices, stock, add-ons, and SLA
  tiers come from `helio-price`.
- Backend runtime features use those dictionaries and price data but do not
  become source of truth for catalog or CMS data.

## Revisium Projects

- `helio-cms`: localized pages, docs, updates, FAQ, navigation, glossary,
  authors, tags, SEO metadata, and media references.
- `helio-price`: server plans, hardware profiles, data centers, regions,
  currencies, billing terms, price books, price items, availability, add-ons,
  SLA tiers, and discount rules.

Every table should stay below `10 000` rows for this demo. Split large price or
availability datasets into purpose-specific tables instead of one oversized
table.

See [`revisium-data-plan.md`](./revisium-data-plan.md) for table-level volumes.

## Runtime Features

Backend-owned features should demonstrate authorized workflows around stable
Revisium source data:

- login and organization membership;
- saved plans;
- quote requests;
- quote comments and status history;
- favorites;
- docs helpful votes or update likes;
- region/currency/language dictionaries;
- customer and partner API keys.

Runtime data must never overwrite catalog, CMS, or price source data.

## Public UX Rule

Public pages must look like a real HelioStack product and purchasing portal.
They should not expose detailed Revisium mechanics, mock-state labels, backend
wiring notes, source-layer widgets, project names, table names, row IDs, or
implementation proof panels.

Revisium details belong in docs, developer/partner documentation, future
internal proof views, PR descriptions, and engineering handoff material. The
customer-facing UI should show business outcomes: servers, price, availability,
locations, documentation, updates, quote flow, and localized content.
