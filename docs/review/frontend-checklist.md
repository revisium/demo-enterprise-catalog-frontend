# Frontend Checklist

- Docs match changed behavior.
- Page status is updated in `docs/product/page-inventory.md`.
- React views do not own data fetching, forms, or business state.
- Mock data is typed and outside React components.
- Forms use `@revisium/forms-core` when they are non-trivial.
- UI fits desktop, tablet, and mobile layouts.
- Source/explainer UI is secondary to the catalog experience.
- `npm run verify` passes.
- CI, Sonar, and review threads are followed to completion.
