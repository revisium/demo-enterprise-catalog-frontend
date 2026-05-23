---
name: frontend-general-checks
description: >-
  Run demo-enterprise-catalog-frontend baseline verification before handoff, PR creation,
  readiness replies, or after addressing review feedback, and report concise
  evidence for branch, docs, commands, generated files, and remaining risks.
metadata:
  short-description: Run frontend verification checks
---

# Frontend General Checks Skill

Use this skill before handoff, before opening a PR, before replying that a PR is
ready, and after addressing review feedback in `demo-enterprise-catalog-frontend`.

## Goal

Run the repo's baseline verification and report enough evidence for another
developer, reviewer, or agent to continue without guessing.

## Preflight

1. Confirm the branch and worktree:

   ```bash
   git status --short --branch
   git diff --check
   ```

2. Identify the change type:
   - docs/config only;
   - frontend implementation;
   - mock contract, GraphQL operation, or codegen;
   - review-thread fix;
   - handoff/bootstrap docs.

3. Read the right contract before checking:
   - `REVIEW.md` for all PRs;
   - affected page spec under `docs/product/pages/` for page work;
   - `docs/architecture/frontend.md` for architecture or source changes;
   - `docs/review/frontend-checklist.md` for PR readiness.

## Required Commands

Run the full repo gate unless the user explicitly asks for a narrower check:

```bash
npm run verify
```

`npm run verify` runs:

```bash
npm run markdown:lint
npm run skills:lint
npm run ui:lint
npm run ts:check
npm run lint:ci
npm run fsd:check
npm run build
```

For docs/config-only changes, also run Prettier against the touched files. For
`.mdc` rule files, pass the Markdown parser explicitly:

```bash
npx prettier --check <touched-md-yaml-json-files>
npx prettier --check --parser markdown .agents/rules/*.mdc
```

For GraphQL changes:

```bash
npm run gql:codegen
git diff -- src/__generated__
```

Generated files must be produced by codegen, not edited manually.

## Output Format

Return a concise verification note:

```text
General checks:
- Branch/worktree:
- Change type:
- Docs/source-of-truth:
- Commands:
- Generated files:
- Remaining risks:
```

If a required command cannot run, say exactly why and name the remaining risk.
Do not claim the branch is ready when a required gate was skipped.
