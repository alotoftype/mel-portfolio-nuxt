#!/bin/bash

# Kill any process on port 3000 (Nuxt)
./kill-ports.sh 3000

NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  unset npm_config_prefix
  unset NPM_CONFIG_PREFIX
  # shellcheck disable=SC1090
  source "$NVM_DIR/nvm.sh"
  nvm use 24 >/dev/null
fi

# Increase file descriptor limit
ulimit -n 10240

echo "File descriptor limit set to: $(ulimit -n)"
echo "Starting Nuxt dev server..."

export SANITY_STUDIO_URL="${SANITY_STUDIO_URL:-http://localhost:3333}"
cd web && npm run dev -- --host localhost --port 3000
