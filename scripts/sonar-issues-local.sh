#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_cmd curl
require_cmd git
require_cmd node

SONAR_ENV_FILE="${SONAR_ENV_FILE:-.env.sonar}"

if [[ -f "${SONAR_ENV_FILE}" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "${SONAR_ENV_FILE}"
  set +a
fi

if [[ -z "${SONAR_TOKEN:-}" ]]; then
  echo "SONAR_TOKEN is required. Create .env.sonar from .env.sonar.example, set SONAR_ENV_FILE, or export SONAR_TOKEN." >&2
  exit 1
fi

SONAR_HOST_URL="${SONAR_HOST_URL:-https://sonarcloud.io}"
PROJECT_KEY="$(sed -n 's/^sonar.projectKey=//p' sonar-project.properties | head -n 1)"

if [[ -z "${PROJECT_KEY}" ]]; then
  echo "sonar.projectKey was not found in sonar-project.properties." >&2
  exit 1
fi

query_args=(
  --get "${SONAR_HOST_URL}/api/issues/search"
  --data-urlencode "componentKeys=${PROJECT_KEY}"
  --data-urlencode "resolved=false"
  --data-urlencode "pageSize=500"
)

if [[ -n "${SONAR_PR_KEY:-}" ]]; then
  query_args+=(--data-urlencode "pullRequest=${SONAR_PR_KEY}")
elif [[ "${GITHUB_EVENT_NAME:-}" == pull_request* && -f "${GITHUB_EVENT_PATH:-}" ]]; then
  pr_number="$(node -e "const fs = require('node:fs'); console.log(JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')).pull_request.number)")"
  query_args+=(--data-urlencode "pullRequest=${pr_number}")
elif command -v gh >/dev/null 2>&1 && pr_json="$(gh pr view --json number 2>/dev/null)"; then
  pr_number="$(node -e "console.log(JSON.parse(process.argv[1]).number)" "$pr_json")"
  query_args+=(--data-urlencode "pullRequest=${pr_number}")
else
  branch_name="$(git rev-parse --abbrev-ref HEAD)"
  query_args+=(--data-urlencode "branch=${branch_name}")
fi

response="$(curl -fsS -u "${SONAR_TOKEN}:" "${query_args[@]}")"

node -e '
const payload = JSON.parse(process.argv[1]);
const issues = payload.issues ?? [];

if (issues.length === 0) {
  console.log("Sonar unresolved issues: 0");
  process.exit(0);
}

console.error(`Sonar unresolved issues: ${payload.total ?? issues.length}`);
for (const issue of issues.slice(0, 50)) {
  const component = String(issue.component ?? "").replace(/^[^:]+:/, "");
  const line = issue.line ? `:${issue.line}` : "";
  console.error(`- ${component}${line} ${issue.rule} ${issue.severity}: ${issue.message}`);
}

if ((payload.total ?? issues.length) > issues.length) {
  console.error(`Only first ${issues.length} issue(s) were returned; narrow the query or increase pagination.`);
}

process.exit(1);
' "$response"
