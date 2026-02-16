#!/bin/bash

# Increase file descriptor limit
ulimit -n 10240

# Verify the limit was set
echo "File descriptor limit set to: $(ulimit -n)"

# Start the dev server
npm run dev
