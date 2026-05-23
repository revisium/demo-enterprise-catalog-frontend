---
name: frontend-pr-review-iteration
description: >-
  Address demo-enterprise-catalog-frontend GitHub PR review threads and failed PR checks by
  triaging unresolved feedback, Sonar and CI failures, making the smallest
  docs/code/config fix, verifying it, replying in thread, and resolving only
  after verification.
metadata:
  short-description: Address frontend PR review threads
---

# Frontend PR Review Iteration Skill

Use this skill when addressing GitHub PR review threads, failed PR checks, or
Sonar feedback for `demo-enterprise-catalog-frontend`.

## Goal

Close review feedback and failed checks by fixing the actual docs/code/config
drift, replying in the review thread when one exists, and resolving only after
verification. Do not create committed review artifacts.

## Workflow

1. Fetch unresolved review threads from the PR. Thread-level state is the
   source of truth for inline feedback; use GitHub GraphQL review threads when
   flat comments are ambiguous.
2. Fetch PR check status. PR checks are the source of truth for CI, required
   checks, and Sonar status:

   ```bash
   gh pr checks --json name,bucket,state,workflow,link,description
   ```

3. Triage each review thread:
   - valid and actionable;
   - already fixed;
   - needs clarification;
   - not applicable, with evidence.
4. Triage each failed, canceled, or pending required check:
   - GitHub Actions failure: inspect the failed job or linked run before
     editing. Use `gh run view <run-id> --log-failed` when the check link points
     to a workflow run.
   - Sonar/SonarQube/SonarCloud failure: inspect the linked quality gate or
     issue list and identify the rule, file, line, and reason before editing.
   - Pending required checks: wait or report that the PR is not ready; do not
     claim the iteration is complete.
   - Passing or skipped non-required checks: record as context, unless the skip
     is unexpected for the change.
5. For valid feedback or failed checks, update the smallest necessary surface:
   - docs first when behavior, UX, architecture, design, navigation, data
     contract, or review rules changed;
   - code when the implementation drifted from the docs;
   - bot/review configs when the enforceable review contract changed.
6. Run the relevant verification commands. For frontend implementation changes,
   run the full gate:

   ```bash
   npm run verify
   ```

7. Re-check PR status after pushing fixes:

   ```bash
   gh pr checks --json name,bucket,state,workflow,link
   ```

8. Reply in the same GitHub review thread with:
   - what changed;
   - where it changed;
   - what verification passed;
   - what PR checks or Sonar status were inspected;
   - any remaining risk.
9. Resolve the thread only after the fix is present and verified. For
   check-only failures, do not invent a review thread; report the check result
   in the assistant response or PR comment when requested.

## Rules

- Start with [`REVIEW.md`](../../../REVIEW.md).
- Treat [`docs/`](../../../docs/) as the implementation source of truth.
- Treat review threads and PR checks as separate work queues. A PR is not ready
  while required checks or Sonar quality gates are failed or pending.
- Do not resolve a thread by only saying "fixed" without pointing to the change.
- Do not batch unrelated review fixes into the same explanation.
- Do not weaken docs, architecture, or review rules to silence a bot unless the
  product contract genuinely changed.
- Do not suppress Sonar findings just to make the check pass. If a finding is a
  false positive, explain the evidence and use the narrowest local suppression
  allowed by the repo.
