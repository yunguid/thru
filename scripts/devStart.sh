#!/bin/bash

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Enable debug logging
export DEBUG=arkon:*

# Start the server
cd "$PROJECT_ROOT/server"
npm run dev &
SERVER_PID=$!

# Start the client
cd "$PROJECT_ROOT/client"
npm run dev &
CLIENT_PID=$!

echo "Server (PID: $SERVER_PID) and Client (PID: $CLIENT_PID) running..."
echo "Debug logging enabled for namespaces: arkon:*"

# Wait for user to exit
read -p "Press Enter to stop..."

kill $SERVER_PID
kill $CLIENT_PID
