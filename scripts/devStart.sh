#!/bin/bash

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Function to kill process on a port
kill_port() {
    local port=$1
    local pid=$(lsof -t -i :$port)
    if [ ! -z "$pid" ]; then
        echo -e "${GREEN}Killing process on port $port (PID: $pid)${NC}"
        kill -9 $pid 2>/dev/null
    fi
}

# Function to start Docker if not running
ensure_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}Docker is not running. Starting Docker...${NC}"
        open -a Docker
        # Wait for Docker to start
        while ! docker info > /dev/null 2>&1; do
            sleep 1
        done
    fi
    
    # Start PostgreSQL if not running
    if ! docker ps | grep -q myapp-db; then
        echo -e "Starting PostgreSQL container..."
        cd "$PROJECT_ROOT" && docker-compose up -d
    fi
}

# Kill existing processes
cleanup() {
    echo -e "\n${GREEN}Cleaning up processes...${NC}"
    # Kill specific processes
    [[ ! -z $SERVER_PID ]] && kill $SERVER_PID 2>/dev/null
    [[ ! -z $CLIENT_PID ]] && kill $CLIENT_PID 2>/dev/null
    
    # Force kill any process on port 4000
    kill_port 4000
    
    # Force kill any process on port 3000
    kill_port 3000
    
    exit 0
}

trap cleanup SIGINT SIGTERM

# Check and start Docker/PostgreSQL
ensure_docker

# Check ports
if check_port 4000; then
    echo -e "${RED}Port 4000 is in use. Attempting to kill the process...${NC}"
    kill_port 4000
    sleep 1
fi

if check_port 3000; then
    echo -e "${RED}Port 3000 is in use. Attempting to kill the process...${NC}"
    kill_port 3000
    sleep 1
fi

# Enable debug logging
export DEBUG=arkon:*

echo -e "${GREEN}Starting services...${NC}"

# Start the server
cd "$PROJECT_ROOT/server"
if [ ! -d "node_modules" ]; then
    echo "Installing server dependencies..."
    npm install
fi
echo -e "${GREEN}Starting server...${NC}"
npm run dev &
SERVER_PID=$!

# Start the client
cd "$PROJECT_ROOT/client"
if [ ! -d "node_modules" ]; then
    echo "Installing client dependencies..."
    npm install
fi
echo -e "${GREEN}Starting client...${NC}"
npm run dev &
CLIENT_PID=$!

echo -e "\n${GREEN}Services running:${NC}"
echo -e "• Server (PID: $SERVER_PID) - http://localhost:4000"
echo -e "• Client (PID: $CLIENT_PID) - http://localhost:3000"
echo -e "• Database - localhost:5432"
echo -e "\n${GREEN}Debug logging enabled for: arkon:*${NC}"

echo -e "\n${GREEN}Press Ctrl+C to stop all services${NC}"
wait
