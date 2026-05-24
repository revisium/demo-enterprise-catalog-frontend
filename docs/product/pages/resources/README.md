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

## Future Contract

- Revisium project: `helio-cms`.
- CMS tables: `docs_articles`, `docs_categories`, `tags`, `authors`,
  `glossary_terms`.
- Backend owns per-user helpful votes, favorites, and read history.
- Public layout must show customer-facing docs and labels only, not source-layer
  proof.
