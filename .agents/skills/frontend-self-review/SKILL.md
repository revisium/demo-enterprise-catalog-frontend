---
name: frontend-self-review
description: >-
  Run the demo-enterprise-catalog-frontend pre-handoff frontend self-review against docs,
  architecture, UX, accessibility, and verification contracts before handing off
  work or opening/updating a PR.
metadata:
  short-description: Self-review enterprise catalog frontend work
---

# Frontend Self-Review Skill

Use this skill before handing off frontend work or opening/updating a PR in
`demo-enterprise-catalog-frontend`.

## Goal

Produce an implementation self-review against the repo contracts. Do not create
or commit separate review artifacts. Put the result in the assistant response,
PR description, or PR comment.

## Required Inputs

- Current branch diff against the target branch.
- [`REVIEW.md`](../../../REVIEW.md).
- [`docs/review/frontend-checklist.md`](../../../docs/review/frontend-checklist.md).
- Affected page specs under [`docs/product/pages/`](../../../docs/product/pages/).
- Architecture/design docs when the change touches their scope.

## Review Steps

1. Identify changed routes, page specs, shared UI patterns, architecture rules,
   generated files, and bot/review config.
2. Check docs-source-of-truth alignment:
   - if route behavior changed, the matching page spec changed;
   - if UX pattern changed, `docs/product/page-patterns.md` changed;
   - if design language/layout/accessibility changed, `docs/design-system/README.md`
     changed;
   - if architecture or review expectations changed, `docs/architecture/frontend.md`,
     `REVIEW.md`, and review bot configs changed together.
3. Check frontend architecture:
   - React views render observable state and forward events only;
   - ViewModels own state, actions, derived values, transitions, and descriptors;
   - DataSources own SDK calls, request lifecycle, response extraction, pagination,
     and transport-level error mapping;
   - repeated rows/cards use List and Item ViewModel boundaries when formatting,
     links, badges, actions, permissions, files, or computed labels are involved;
   - computed getters are preferred for derived read models;
   - methods stay at one abstraction level;
   - one non-trivial React component lives in one file;
   - generated files are not hand-edited.
4. Check UX and accessibility against the affected page spec and design system.
5. Run or verify the required commands:

```bash
npm run verify
```

## Output Format

Return a concise self-review:

```text
Self-review:
- Docs/source-of-truth:
- Architecture:
- UX/accessibility:
- Verification:
- Remaining risks:
```

If docs and code disagree, treat it as a blocker. Either update the docs in the
same change or change the code back to match the docs.
