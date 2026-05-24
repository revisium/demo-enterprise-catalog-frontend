# Customer Portal

## Purpose

Prototype the authorized workspace for saved plans, quote lifecycle, favorites,
organization-owned API keys, and account actions.

## Current Data Mode

Typed backend mock data with organization-scoped runtime state.

## Future Contract

- Backend owns users, organizations, saved plans, quote requests, quote comments,
  favorites, API keys, and audit trail.
- Revisium-owned catalog, price, docs, and update rows are referenced by stable
  IDs but are not mutated by portal actions.
- Portal actions must stay separate from public catalog source data.

## UX Scope

- switch between customer organizations;
- show account-specific metrics, quote follow-ups, saved plans, favorites, API
  keys, and audit events;
- let a user favorite saved plans without mutating public catalog data;
- keep API key scopes and audit history visible as account-level controls.

## Next UI Decisions

- Quote detail conversation pattern.
- Saved-plan edit and share affordances.
- API key creation, scope review, and audit history.
