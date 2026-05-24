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

## Future Contract

- Revisium project: `helio-cms`.
- CMS tables: `updates`, `authors`, `tags`.
- Related price/catalog references later point to `helio-price` rows.
- Backend owns per-user likes, follows, notification preferences, and read
  history.
- Revision/diff evidence must link to real Revisium revisions from the separate
  explainer surface after connection.
