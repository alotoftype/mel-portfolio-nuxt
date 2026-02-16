#!/bin/bash

# Kill any process on port 3000 (Nuxt)
./kill-ports.sh 3000

# Increase file descriptor limit
ulimit -n 10240

echo "File descriptor limit set to: $(ulimit -n)"
echo "Starting Nuxt dev server..."

cd web && npm run dev
