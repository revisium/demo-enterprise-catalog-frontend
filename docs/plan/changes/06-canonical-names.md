# 06 — Canonical section names (N5)

## Context

One section is named several ways: menu `Servers` vs title "Server catalog";
menu `Updates` vs route `/releases` vs title "Product updates"; menu `Console`
vs title "Customer console". Pick one word per section and align menu, title,
eyebrow, and breadcrumb. Routes stay as-is.

## Decision

Canonical: **Servers / Pricing / Locations / Compare / Resources / Updates /
Console**.

## Change

- Align page `SectionEyebrow` + `<h1>` to the canonical word:
  - Catalog title `Server catalog` -> eyebrow `Servers`, keep an h1 that reads
    naturally (e.g. `Servers`), consistent with the menu.
  - Releases title `Product updates` -> `Updates`.
  - Console title `Customer console` -> `Console`.
- Use the same labels in breadcrumbs (`04`) and footer groups.
- Centralize in i18n so menu/title/breadcrumb read one key.

## Files

- `src/shared/i18n/messages.ts` (reuse `nav.*` keys for titles/breadcrumbs)
- page headers: Catalog, Releases, CustomerPortal (+ any mismatched eyebrow)
- `src/app/layouts/AppLayout/AppLayout.tsx` (footer labels already use `nav.*`)

## Acceptance

- For each section, menu label == breadcrumb label == page title word.
- `npm run verify` green; i18n covers 6 locales.
