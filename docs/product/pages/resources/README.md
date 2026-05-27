# Resources

## Purpose

List customer docs, planning guides, API notes, tags, categories, and helpful
feedback affordances.

## Current Data Mode

Typed mock CMS article data plus local saved/helpful state.

## Query Shape

- category chips model section filtering;
- role, topic, and sort controls model CMS article list queries;
- topic tags model dictionary-style terms shared across docs and updates;
- helpful and saved actions model user-owned runtime feedback.

## UX Scope

- filter docs by customer task, team role, and topic;
- sort by recommendation, freshness, helpfulness, or read time;
- keep a saved-read sidebar;
- open `/resources/:slug` for one article with body sections, a practical
  checklist, actions, and related guides;
- show helpful feedback without exposing source-layer mechanics.

## Layout Contract

- Resources uses the shared public-page rhythm from pricing and locations:
  compact intro, filters spanning two columns, and a right-side featured guide
  panel;
- article results render as dense readable records with category, role, update
  date, summary, tags, read time, helpful count, save, and open actions;
- the right rail keeps topics, saved reads, and section counts aligned to the
  same third-column width as the featured panel, directly below it;
- Resource Detail uses an item-page layout with a continuous third-column rail:
  intro/body/checklist/related-guide content spans the first two columns, while
  the dark guide summary, actions, and next paths stack in the right column;
- related guides on detail pages use the same three-card grid pattern as the
  checklist;
- public docs copy must stay customer-facing and must not expose CMS table,
  source, mock, or proof mechanics.

## Future Contract

- Revisium project: `helio-cms`.
- CMS tables: `docs_articles`, `docs_categories`, `tags`, `authors`,
  `glossary_terms`.
- Backend owns per-user helpful votes, favorites, and read history.
- Public layout must show customer-facing docs and labels only, not source-layer
  proof.
