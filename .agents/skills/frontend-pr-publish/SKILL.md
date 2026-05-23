---
name: frontend-pr-publish
description: >-
  Publish verified demo-enterprise-catalog-frontend work by creating or reusing a conventional
  branch from fresh master, checking for an existing GitHub PR, committing,
  pushing, and creating a PR with an intentionally empty description when one
  does not already exist.
metadata:
  short-description: Publish verified frontend work to PR
---

# Frontend PR Publish Skill

Use this skill when the user asks to create a branch, commit local changes,
push, and open or update a GitHub PR for `demo-enterprise-catalog-frontend`.

## Goal

Publish the current verified work and return the PR URL. The workflow must not
create duplicate PRs. A new PR must have an empty description.

## Required Inputs

- Target base branch. Default: `master`.
- Branch intent and conventional prefix. Infer from the change when obvious;
  otherwise ask before publishing.
- Commit title. Use a conventional commit prefix matching the branch prefix.

Allowed branch prefixes:

```text
feat/
fix/
docs/
chore/
refactor/
test/
ci/
build/
perf/
```

Do not use `codex/` in branch names.

## Preflight

1. Inspect branch, remote, and local changes:

   ```bash
   git status --short --branch
   git remote -v
   gh auth status
   ```

2. Refuse to publish from `master` directly. `master` is only the base.
3. If currently on `master` with local changes, fetch fresh base first and
   create the publish branch from `origin/master`, carrying the local changes
   only when Git can do so without conflicts:

   ```bash
   git fetch origin master
   git switch -c <prefix>/<slug> origin/master
   ```

4. If already on a non-master branch, fetch fresh base and check whether a PR
   already exists for the current branch before deciding whether to squash:

   ```bash
   git fetch origin master
   gh pr view --json url,state,baseRefName,headRefName
   ```

   If `gh pr view` exits because no PR exists, continue with the new-PR path.

## Verification Gate

Always run the full gate before staging, committing, pushing, creating a PR, or
replying that work is published:

```bash
npm run verify
```

If `npm run verify` fails, stop. Do not commit, push, create a PR, or update an
existing PR until the failure is fixed and the command passes.

## Existing PR Path

Use this path when a PR already exists for the publish branch:

1. Confirm the PR base is the target base branch.
2. Stage only intended files:

   ```bash
   git status --short
   git add <intended-files>
   git diff --cached --check
   ```

3. Commit normally:

   ```bash
   git commit -m "<type>: <summary>"
   ```

4. Push the branch:

   ```bash
   git push
   ```

5. Return the existing PR URL. Do not squash an already-open PR unless the user
   explicitly asks for history rewrite.

## New PR Path

Use this path when no PR exists for the publish branch:

1. Make sure the branch starts from fresh `origin/master` and follows the
   allowed prefix pattern.
2. Stage only intended files:

   ```bash
   git status --short
   git add <intended-files>
   git diff --cached --check
   ```

3. Create one clean commit. If the branch already has multiple local commits and
   no PR exists, squash them into one commit before pushing:

   ```bash
   git commit -m "<type>: <summary>"
   ```

4. Push with upstream:

   ```bash
   git push -u origin <prefix>/<slug>
   ```

5. Create the PR with an empty description:

   ```bash
   gh pr create --base <target-base> --head <prefix>/<slug> --title "<type>: <summary>" --body ""
   ```

6. Return the new PR URL.

## Output Format

Return a concise publish note:

```text
Publish:
- Branch:
- PR:
- Existing PR:
- Verification:
- Commit:
- Push:
- Remaining risks:
```
