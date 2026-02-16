#!/bin/bash

# Kill processes running on specified ports
# Usage: ./kill-ports.sh [port1] [port2] ...

# Default ports for this project
DEFAULT_PORTS=(3000 3333 24678)

# Use provided ports or defaults
PORTS=("${@:-${DEFAULT_PORTS[@]}}")

echo "🔍 Checking for processes on ports: ${PORTS[*]}"
echo ""

for PORT in "${PORTS[@]}"; do
  # Find process ID using the port
  PID=$(lsof -ti:$PORT)

  if [ -n "$PID" ]; then
    echo "⚠️  Port $PORT is in use by PID $PID"

    # Get process name
    PROCESS_NAME=$(ps -p $PID -o comm= 2>/dev/null)
    echo "   Process: $PROCESS_NAME"

    # Kill the process
    echo "   Killing process..."
    kill -9 $PID 2>/dev/null

    if [ $? -eq 0 ]; then
      echo "   ✅ Successfully killed process on port $PORT"
    else
      echo "   ❌ Failed to kill process on port $PORT"
    fi
    echo ""
  else
    echo "✅ Port $PORT is available"
    echo ""
  fi
done

echo "🎉 Port cleanup complete!"
