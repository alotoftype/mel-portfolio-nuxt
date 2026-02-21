#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

if [ -z "${NETLIFY_AUTH_TOKEN:-}" ]; then
  echo "NETLIFY_AUTH_TOKEN is missing in .env"
  exit 1
fi

NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1090
  source "$NVM_DIR/nvm.sh"
  nvm use 24 >/dev/null
fi

echo "Building Sanity Studio..."
npm --prefix sanity run build

echo "Deploying Sanity Studio to production..."
netlify deploy \
  --auth "$NETLIFY_AUTH_TOKEN" \
  --site aeb06e9f-f4af-44f5-8639-a7da60ecf3c5 \
  --dir sanity/dist \
  --prod \
  --no-build
