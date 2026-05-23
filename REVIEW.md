# Frontend Review Contract

This file is the review entry point for human reviewers, CodeRabbit, Cubic, and
AI coding agents. The frontend is being built document-first and mock-first
until the UI contracts are stable enough to connect Revisium projects and the
backend runtime layer.

## Required Reading

Before reviewing a PR that touches frontend code or page docs, read:

1. [`docs/handoff/README.md`](./docs/handoff/README.md)
2. [`docs/architecture/frontend.md`](./docs/architecture/frontend.md)
3. [`docs/product/page-inventory.md`](./docs/product/page-inventory.md)
4. The affected page spec under [`docs/product/pages/`](./docs/product/pages/README.md)
5. [`docs/design-system/README.md`](./docs/design-system/README.md) for UI changes

## Docs Source Of Truth

`docs/` is the frontend implementation source of truth. A PR is incomplete when
code changes behavior, route structure, page composition, data contracts, copy,
navigation, responsive behavior, accessibility expectations, architecture,
design language, or review rules without updating the matching canonical docs.

The companion docs repo owns the public passport, architecture summary, and
product story. This repo owns exact page contracts, implementation status,
frontend architecture, design system, review gates, and handoff state.

## Mock-First Rule

Until the first UI direction is selected, frontend pages use typed mock data and
mock interaction states. Do not add backend, Revisium Cloud, or generated-client
coupling just to make early UI pages look more complete.

Mocks must still be contract-shaped:

- DataSource classes own mock access and later transport mapping.
- ViewModels own state, actions, derived values, and form orchestration.
- React views render ViewModel state and forward events.
- Page specs name future Revisium tables, backend interactions, and proof UI.

## Forms Rule

Use `@revisium/forms-core` for new non-trivial forms. Forms belong in ViewModels
or model helpers, not directly in React component state.

## Review Priorities

Block a PR when any of these are true:

- Code contradicts the page spec, design system, architecture doc, or this file.
- User-visible code changes without a matching docs update.
- React components fetch data, build API payloads, own business state, or create
  form engines directly.
- Page-specific CSS classes are introduced for component styling instead of
  Chakra primitives, style props, or theme tokens.
- Mock data is untyped or placed directly in React views.
- Shared abstractions are introduced before two real consumers need them.
- A file exports multiple non-trivial React components.
- A non-test component file under `src/**/ui/` is not placed in a same-named
  folder, or a component folder contains a barrel file.
- Generated files under `src/__generated__/` are hand-edited.
- TypeScript, lint, markdown, FSD, build, GitHub Actions, Sonar, or unresolved
  review-thread failures are ignored.

## Required Verification

Run before opening or updating a PR:

```bash
npm run verify
```

After PR creation, inspect CI and Sonar. Quality Gate success is not enough:
valid new Sonar issues must be fixed, not ignored.

When `SONAR_TOKEN` is available locally, run:

```bash
npm run ci:local:sonar
```

If the token is stored in another local repo, set `SONAR_ENV_FILE` instead of
copying the secret into this repo.

Do not replace this with `npm run sonar:issues:local` before PR updates.
`sonar:issues:local` only checks unresolved issues; it does not validate Quality
Gate conditions such as duplicated lines density. Duplication failures must be
found locally with `npm run ci:local:sonar` or `npm run sonar:local` before
waiting for remote SonarCloud.
