#!/bin/bash

# Deployment script for Next.js application
# This script can be run manually on the server or called from CI/CD

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration (can be overridden by environment variables)
DEPLOY_PATH=${DEPLOY_PATH:-$(pwd)}
PM2_APP_NAME=${PM2_APP_NAME:-"sandesh-portfolio"}
NODE_ENV=${NODE_ENV:-"production"}

echo -e "${GREEN}Starting deployment...${NC}"
echo -e "Deploy path: ${DEPLOY_PATH}"
echo -e "PM2 app name: ${PM2_APP_NAME}"
echo ""

# Navigate to deployment directory
cd "$DEPLOY_PATH"

# Check if .env file exists
if [ -f .env ]; then
    echo -e "${YELLOW}Loading environment variables...${NC}"
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${YELLOW}Warning: .env file not found${NC}"
fi

# Install/update dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm ci --production=false

# Build the application
echo -e "${GREEN}Building application...${NC}"
npm run build

# Restart PM2 process
echo -e "${GREEN}Restarting PM2 process...${NC}"
if pm2 list | grep -q "$PM2_APP_NAME"; then
    pm2 restart "$PM2_APP_NAME"
    echo -e "${GREEN}PM2 process '$PM2_APP_NAME' restarted${NC}"
else
    echo -e "${YELLOW}PM2 process '$PM2_APP_NAME' not found, starting new process...${NC}"
    pm2 start npm --name "$PM2_APP_NAME" -- start
    pm2 save
fi

# Show PM2 status
echo -e "${GREEN}PM2 Status:${NC}"
pm2 list

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"

