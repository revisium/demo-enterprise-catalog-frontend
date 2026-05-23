# Repo-Local Agent Workflows

This directory contains agent-facing workflows and rules for
`demo-enterprise-catalog-frontend`. They exist to enforce the same source-of-truth contract as
[`../docs/`](../docs/), [`../REVIEW.md`](../REVIEW.md),
[`../.coderabbit.yaml`](../.coderabbit.yaml), and [`../cubic.yaml`](../cubic.yaml).

They are not a separate product or architecture source of truth. When behavior,
UX, data contracts, architecture, design, or review policy changes, update the
canonical docs first.

## Skills

- [`frontend-self-review`](./skills/frontend-self-review/SKILL.md) — pre-handoff
  self-review for implementation branches and PR updates.
- [`frontend-general-checks`](./skills/frontend-general-checks/SKILL.md) —
  baseline verification before handoff, PR creation, and review-thread replies.
- [`frontend-pr-review-iteration`](./skills/frontend-pr-review-iteration/SKILL.md)
  — GitHub review-thread and failed-check workflow: fetch, triage, fix, reply,
  resolve after verification.
- [`frontend-pr-publish`](./skills/frontend-pr-publish/SKILL.md) — verified
  branch, commit, push, and PR creation workflow from fresh `master`.

Every `SKILL.md` must include YAML frontmatter with `name` and `description`.
`npm run skills:lint` enforces the repo-local skill format and is part of
`npm run verify`.

## Rules

Rules under [`rules/`](./rules/) are short reusable constraints for agents and
editors that understand `.mdc` rule files.
