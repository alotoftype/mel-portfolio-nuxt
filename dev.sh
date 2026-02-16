#!/bin/bash

# Kill any processes on ports 3000 (Nuxt) and 3333 (Sanity)
./kill-ports.sh 3000 3333

# Increase file descriptor limit
ulimit -n 10240

echo "File descriptor limit set to: $(ulimit -n)"
echo "Starting both dev servers..."
echo ""

npm run dev
