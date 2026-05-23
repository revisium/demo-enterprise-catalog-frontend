# Customer Portal

## Purpose

Prototype the authorized workspace for saved plans, quote lifecycle, favorites,
organization-owned API keys, and account actions.

## Current Data Mode

Typed backend mock data with local favorite state.

## Future Contract

- Backend owns users, organizations, saved plans, quote requests, quote comments,
  favorites, API keys, and audit trail.
- Revisium-owned catalog, price, docs, and update rows are referenced by stable
  IDs but are not mutated by portal actions.
- Portal actions must stay separate from public catalog source data.

## Next UI Decisions

- Auth shell and organization switcher.
- Quote detail conversation pattern.
- Saved-plan edit and share affordances.
- API key creation, scope review, and audit history.
