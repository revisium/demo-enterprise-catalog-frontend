# Frontend Architecture

The stack follows the regular Revisium frontend shape: React Router SSR,
Feature-Sliced Design, MobX ViewModels, typed data contracts, and one local
verification command.

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
- `@revisium/forms-core` is the default for non-trivial forms. Use the alpha
  package until the GitHub source package includes built `dist` artifacts.
- Generated files under `src/__generated__/` are never hand-edited.

## Backend Connection Rule

Do not connect backend or Revisium Cloud APIs until the page contract is stable
enough to preserve. Mock-first does not mean throwaway: mock shapes should become
candidate GraphQL/REST/Revisium contracts.
