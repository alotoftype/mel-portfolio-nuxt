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

export NITRO_PRESET=netlify

echo "Building web app for Netlify..."
npm --prefix web run build

echo "Deploying web app to production (melshotya.com)..."
netlify deploy \
  --auth "$NETLIFY_AUTH_TOKEN" \
  --site 8434024c-2e56-4a53-9fc9-07d4e5a886a8 \
  --dir web/dist \
  --functions web/.netlify/functions-internal \
  --prod \
  --no-build
