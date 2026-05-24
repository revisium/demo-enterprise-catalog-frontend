# Customer Portal

## Purpose

Prototype the authorized workspace for saved plans, quote lifecycle, favorites,
and account actions.

## Current Data Mode

Typed backend mock data with organization-scoped runtime state.

## Future Contract

- Backend owns users, organizations, saved plans, quote requests, quote comments,
  favorites, and audit trail.
- Revisium-owned catalog, price, docs, and update rows are referenced by stable
  IDs but are not mutated by portal actions.
- Portal actions must stay separate from public catalog source data.

## UX Scope

- switch between customer organizations;
- show account-specific metrics, quote follow-ups, saved plans, favorites, and
  audit events;
- open `/app/quotes/:quoteId` for one authenticated quote timeline,
  conversation, organization context, and related saved plans;
- open `/app/plans/:planId` for one saved server package, related quotes, and
  next actions;
- let a user favorite saved plans without mutating public catalog data;
- keep audit history visible as account-level context.

## Next UI Decisions

- Saved-plan edit and share affordances.
- Quote conversation actions: reply, approve, request change, and attachment
  preview.
