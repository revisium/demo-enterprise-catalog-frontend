# 09 — Console cleanup (D6)

## Context

The Customer console workspace shows `Session: Secure cookie` and
`Device: Recognized` — auth-demo internals leaking into customer UI.

## Change

- Remove the `Session` and `Device` rows from `sessionRows`; keep `Role`.
- `session` stays used elsewhere (org id, current user), so no further wiring
  changes.
- Relabel the `Reference checks` badges to plain-language copy (required, exact):
  `Active` -> `Available`, `Allowed` -> `Allowed for your org`,
  `Published` -> `Published`. Apply across language/currency/region/plan/docs
  rows.

## Files

- `src/pages/CustomerPortal/model/CustomerPortalPageViewModel.ts` (`sessionRows`)
- `src/pages/CustomerPortal/api/CustomerPortalPageDataSource.ts`
  (`getReferenceChecks` labels) if relabeling

## Acceptance

- No `Session` / `Device` fields in the console.
- Reference-check badges show the exact relabeled copy above.
- `npm run verify` green.
