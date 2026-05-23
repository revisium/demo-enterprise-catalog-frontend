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

require_cmd docker
require_cmd git

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
SONAR_SCANNER_VERSION="${SONAR_SCANNER_VERSION:-12.1.0.3225_8.0.1}"
SONAR_QUALITYGATE_TIMEOUT="${SONAR_QUALITYGATE_TIMEOUT:-300}"

scanner_args=(
  "-Dsonar.qualitygate.wait=true"
  "-Dsonar.qualitygate.timeout=${SONAR_QUALITYGATE_TIMEOUT}"
)

if [[ -n "${SONAR_PR_KEY:-}" ]]; then
  scanner_args+=(
    "-Dsonar.pullrequest.key=${SONAR_PR_KEY}"
    "-Dsonar.pullrequest.branch=${SONAR_PR_BRANCH:-$(git rev-parse --abbrev-ref HEAD)}"
    "-Dsonar.pullrequest.base=${SONAR_PR_BASE:-master}"
  )
elif command -v gh >/dev/null 2>&1 && pr_json="$(gh pr view --json number,headRefName,baseRefName 2>/dev/null)"; then
  require_cmd node
  pr_number="$(node -e "console.log(JSON.parse(process.argv[1]).number)" "$pr_json")"
  pr_branch="$(node -e "console.log(JSON.parse(process.argv[1]).headRefName)" "$pr_json")"
  pr_base="$(node -e "console.log(JSON.parse(process.argv[1]).baseRefName)" "$pr_json")"
  scanner_args+=(
    "-Dsonar.pullrequest.key=${pr_number}"
    "-Dsonar.pullrequest.branch=${pr_branch}"
    "-Dsonar.pullrequest.base=${pr_base}"
  )
else
  branch_name="$(git rev-parse --abbrev-ref HEAD)"
  echo "No GitHub PR found; running Sonar branch analysis for ${branch_name}." >&2
  echo "If SonarCloud rejects non-main branches, create the PR first or set SONAR_PR_KEY." >&2
  scanner_args+=("-Dsonar.branch.name=${branch_name}")
fi

docker run --rm \
  -e SONAR_TOKEN \
  -e SONAR_HOST_URL="${SONAR_HOST_URL}" \
  -e SONAR_USER_HOME=/usr/src/.sonar \
  -v "$ROOT_DIR:/usr/src" \
  "sonarsource/sonar-scanner-cli:${SONAR_SCANNER_VERSION}" \
  "${scanner_args[@]}" \
  "$@"
