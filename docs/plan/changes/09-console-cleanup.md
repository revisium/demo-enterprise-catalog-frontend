# 09 — Console cleanup (D6)

## Context

The Customer console workspace shows `Session: Secure cookie` and
`Device: Recognized` — auth-demo internals leaking into customer UI.

## Change

- Remove the `Session` and `Device` rows from `sessionRows`; keep `Role`.
- `session` stays used elsewhere (org id, current user), so no further wiring
  changes.
- While here, relabel `Reference checks` badges (`Active`/`Allowed`/`Published`)
  into plain-language customer wording (e.g. "Language available",
  "Currency allowed for your org") — optional but recommended.

## Files

- `src/pages/CustomerPortal/model/CustomerPortalPageViewModel.ts` (`sessionRows`)
- `src/pages/CustomerPortal/api/CustomerPortalPageDataSource.ts`
  (`getReferenceChecks` labels) if relabeling

## Acceptance

- No `Session` / `Device` fields in the console.
- `npm run verify` green.
