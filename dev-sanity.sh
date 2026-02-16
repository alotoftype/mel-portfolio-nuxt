#!/bin/bash

# Kill any process on port 3333 (Sanity Studio)
./kill-ports.sh 3333

# Increase file descriptor limit
ulimit -n 10240

echo "File descriptor limit set to: $(ulimit -n)"
echo "Starting Sanity Studio..."

cd sanity && npm run dev
