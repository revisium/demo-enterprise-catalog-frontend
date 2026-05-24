# Customer Portal

## Purpose

Prototype the authorized workspace for user-specific saved plans, quote
lifecycle, favorites, preferences, and account actions.

## Current Data Mode

Typed backend mock data with user-scoped runtime state and a demo session refresh
that sets backend-owned cookies.

## Future Contract

- Backend owns users, organizations, saved plans, quote requests, quote comments,
  favorites, and audit trail.
- Revisium-owned catalog, price, docs, and update rows are referenced by stable
  IDs but are not mutated by portal actions.
- Portal actions must stay separate from public catalog source data.
- Demo session refresh sets `HttpOnly` cookies. The frontend must not read a
  refresh payload for identity; browser requests carry cookies automatically.
- Backend resolves the current user from the session cookie before returning
  authenticated page data or accepting runtime mutations. Page data may include
  safe display context, but refresh itself has no readable identity response.
- Before persisting runtime data, backend validates referenced dictionary/source
  IDs through Revisium: language, currency, region, plan, quote status, role,
  docs, and updates.

## UX Scope

- switch between customer organizations;
- show signed-in user context, organization metrics, quote follow-ups, saved
  plans, favorites, preferences, and audit events;
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
