# Customer Console

## Purpose

Prototype the authorized customer console for user-specific saved plans, quote
lifecycle, favorites, preferences, and account actions.

## Current Data Mode

Typed backend mock data with user-scoped runtime state and a demo session refresh
that sets backend-owned cookies.

## Future Contract

- Backend owns users, organizations, saved plans, quote requests, quote comments,
  favorites, and audit trail.
- Revisium-owned catalog, price, docs, and update rows are referenced by stable
  IDs but are not mutated by portal actions.
- Console actions must stay separate from public catalog source data.
- Demo session refresh sets `HttpOnly` cookies. The frontend must not read a
  refresh payload for identity; browser requests carry cookies automatically.
- Backend resolves the current user from the session cookie before returning
  authenticated page data or accepting runtime mutations. Page data may include
  safe display context, but refresh itself has no readable identity response.
- Before persisting runtime data, backend validates referenced dictionary/source
  IDs through Revisium: language, currency, region, plan, quote status, role,
  docs, and updates.
- The console prototype shows these checks as customer-facing reference status,
  not as source-layer internals: active language, allowed currency, available
  region, active saved plan, and published docs/update targets.
- Detail routes must enforce the same user scope as `/app`; opening another
  user's saved plan or quote shows an access state instead of customer data.
- Mock action routes represent future backend mutations:
  `/app/actions/preferences`, `/app/actions/favorites`,
  `/app/actions/quote-comments`, and `/app/actions/content-feedback`.

## UX Scope

- switch between customer organizations;
- show signed-in user context, organization metrics, quote follow-ups, saved
  plans, favorites, preferences, and audit events;
- show reference checks for the current user and organization so backend
  validation is visible without exposing source mechanics;
- keep the console simple: it is a workspace for saved plans, quote follow-up,
  favorites, preferences, and recent activity, not a full admin application;
- open `/app/quotes/:quoteId` for one authenticated quote timeline,
  conversation, organization context, and related saved plans;
- open `/app/plans/:planId` for one saved server package, related quotes, and
  next actions;
- let a user favorite saved plans, save defaults, save updates, and add quote
  notes without mutating public catalog data;
- keep audit history visible as account-level context.

## Layout Contract

- Use the visible label `Console` for the customer workspace.
- Prefer short page copy and prominent page titles.
- Use the shared three-column rail on desktop: primary customer work spans the
  first two columns and workspace navigation, preferences, actions, and activity
  stay aligned in the right column.
- Keep saved-plan and quote detail routes in the same item-detail pattern as the
  catalog pages: light intro panel spans two columns, dark summary panel uses the
  third column, and follow-up actions live in the right rail below.
- On mobile, stack rail cards after the primary content and keep row internals
  allowed to scroll or wrap rather than forcing unreadable compression.
- Runtime actions should feel like normal customer actions. Do not expose
  Revisium project/table mechanics in the console layout.

## Next UI Decisions

- Saved-plan edit and share affordances.
- Quote conversation actions: reply, approve, request change, and attachment
  preview.
