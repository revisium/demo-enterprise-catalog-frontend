# Releases

## Purpose

Show catalog, price-book, docs, and region updates with customer impact and
runtime reaction affordances.

## Current Data Mode

Typed mock CMS update data plus local saved/like state.

## Query Shape

- update type chips model feed filtering by catalog, pricing, docs, or region;
- audience, priority, and sort controls model customer-facing announcement
  queries;
- saved updates and likes model user-owned runtime feedback;
- update tags can later share the same dictionary service as docs and UI labels.

## UX Scope

- filter announcements by change area, audience, and priority;
- sort by latest, priority, or reactions;
- show customer impact next to every update;
- open `/releases/:slug` for one update with impact detail, affected customer
  workspaces, reactions, and related updates;
- keep saved announcements for follow-up planning.

## Layout Contract

- Releases uses the same public-page grid as resources and locations: filters
  span two columns and the latest visible update occupies the right rail;
- show a compact desktop-only raster intro visual that signals release/change
  activity without replacing the update feed;
- update rows stay dense and scan-friendly, with date, type, audience, priority,
  summary, tags, customer impact, reactions, save, and open actions visible in
  one record;
- saved updates and feed mix stay in the aligned third-column rail rather than
  using a separate narrow sidebar width;
- show the primary reset action only while feed filters or sort differ from the
  default query, and hide it after reset;
- make update list items and saved-update items clickable with hover feedback
  instead of rendering separate `Open update` or `Open` buttons, while keeping
  like and save buttons explicit;
- Release Detail uses an item-page layout with the update intro spanning two
  columns, a dark summary card on the right, and impact detail/affected
  workspaces separated from update actions and related updates;
- public update copy must stay customer-facing and must not expose source-layer
  revision proof until the secondary explainer surface is connected.

## Future Contract

- Revisium project: `helio-cms`.
- CMS tables: `updates`, `authors`, `tags`.
- Related price/catalog references later point to `helio-price` rows.
- Backend owns per-user likes, follows, notification preferences, and read
  history.
- Revision/diff evidence must link to real Revisium revisions from the separate
  explainer surface after connection.
