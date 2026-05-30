# 04 — Breadcrumbs + labeled back (N1, N2, N4)

## Context

Today the only "up/back" affordance is a bare `<-` arrow (no label), and there
are no breadcrumbs. One nav axis, no "you are here". The `from`-state back is
good (returns to the filtered list) but is lost on reload/share.

Keep two axes:

- **Breadcrumb = hierarchy/up**, derived from the route/VM (survives reload).
- **Labeled back = return to my filtered list**, from `from`-state.

## Change

- N1: `BackNavButton` renders a destination label (`<- Back to results` when a
  `from`-state exists, else `<- {parentLabel}` from `fallbackTo`). Keep the
  resolve -> history -> fallback chain.
- N2: new `src/shared/ui/Breadcrumbs/Breadcrumbs.tsx` rendering a trail + JSON-LD
  `BreadcrumbList`. Each detail VM exposes `breadcrumbs: {label, href}[]`.
- N4: remove the conditional bare arrow (`showOnlyWithReturnState`) from
  top-level pages once breadcrumbs exist; keep labeled back on detail pages.

## Breadcrumb trail map

```text
/catalog/:id         Home > Servers > {family} > {plan}
/pricing/:bookId     Home > Pricing > {book}
/locations/:regionId Home > Locations > {region}
/resources/:slug     Home > Resources > {category} > {article}
/releases/:slug      Home > Updates > {update}
/app/plans/:id       Home > Console > Saved plans > {plan}
/app/quotes/:id      Home > Console > Quotes > {quote}
```

## Files

- `src/shared/ui/BackNavButton/BackNavButton.tsx` + `src/shared/ui/index.ts`
- new `src/shared/ui/Breadcrumbs/Breadcrumbs.tsx`
- detail pages + VMs (ProductDetail, PricingDetail, LocationDetail,
  ResourceDetail, ReleaseDetail, PortalSavedPlanDetail, PortalQuoteDetail)
- top-level pages (remove `showOnlyWithReturnState` BackNavButton)
- i18n: `nav.backToResults`, `nav.back` (6 locales)

## Acceptance

- Every detail route shows a breadcrumb trail + a labeled back when arrived from
  a filtered list.
- Breadcrumbs render correctly after a hard reload (no `from`-state).
- Top-level pages no longer show the bare arrow.
- `npm run verify` green.
