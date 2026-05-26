# Frontend Architecture

The stack follows the regular Revisium frontend shape: React Router SSR,
Feature-Sliced Design, MobX ViewModels, Chakra UI, typed data contracts, and one
local verification command.

## Layers

- `app`: routes and app layout.
- `pages`: route-level page slices.
- `widgets`: reusable composed UI blocks such as source/explainer panels.
- `entities`: domain types and mock records.
- `shared`: cross-page UI, config, forms, and infrastructure helpers.

## Ownership

- DataSources own mock access now and transport mapping later.
- ViewModels own state, actions, derived values, validation, and form engines.
- React components render state and forward events.
- Chakra UI owns component styling. Do not add page-specific CSS classes for
  layout, cards, buttons, badges, or forms; use Chakra primitives, style props,
  and the app theme instead.
- `@revisium/forms-core` is the default for non-trivial forms. Use the alpha
  package until the GitHub source package includes built `dist` artifacts.
- Generated files under `src/__generated__/` are never hand-edited.
- Localization metadata and the temporary frontend translation harness live
  under `src/shared/i18n`. The active language selector stores the selected
  locale in browser storage, updates document `lang`/`dir`, and runs a visual
  DOM translation pass across public and portal routes. The visual pass exists
  to stress responsive layouts while mock data is still English-first. Reloads
  use the locale cookie and a small boot script so non-English routes do not
  flash English content before hydration. Brand and product names can opt out
  with `data-i18n-skip`; durable page-level translations should still come from
  CMS/price data later, once contracts are stable enough to preserve.

## UI System

- `src/app/providers/chakraTheme.ts` owns palette, radii, shadows, and global
  element-level reset.
- `src/shared/ui/global.css` is intentionally minimal and must not become a
  page styling layer.
- Shared visuals that need repeated style props belong in small shared UI
  components, not in ad hoc class selectors.

## Backend Connection Rule

Do not connect backend or Revisium Cloud APIs until the page contract is stable
enough to preserve. Mock-first does not mean throwaway: mock shapes should become
candidate GraphQL/REST/Revisium contracts.
