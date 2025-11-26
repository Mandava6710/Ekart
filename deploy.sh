#!/bin/bash

# Ekart Deployment Script
# Usage: ./deploy.sh

set -e

echo "=========================================="
echo "Ekart Deployment Script"
echo "=========================================="

# Variables
REPO_URL="https://github.com/Mandava6710/Ekart.git"
APP_DIR="/var/www/ekart"
BACKUP_DIR="/var/backups/ekart"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root"
fi

log "Starting deployment..."

# Step 1: Create directories if they don't exist
log "Creating application directories..."
mkdir -p $APP_DIR
mkdir -p $BACKUP_DIR

# Step 2: Backup current deployment
if [ -d "$APP_DIR/target" ]; then
    log "Backing up current deployment..."
    cp -r $APP_DIR/target $BACKUP_DIR/target_$TIMESTAMP
    log "Backup created at $BACKUP_DIR/target_$TIMESTAMP"
fi

# Step 3: Clone or pull repository
log "Fetching latest code from GitHub..."
if [ -d "$APP_DIR/.git" ]; then
    cd $APP_DIR
    git pull origin main || error "Failed to pull from GitHub"
else
    cd /var/www
    git clone $REPO_URL ekart || error "Failed to clone repository"
    cd $APP_DIR
fi

# Step 4: Build backend
log "Building backend application..."
if ! mvn clean package -DskipTests -q; then
    error "Backend build failed"
fi
log "Backend build completed successfully"

# Step 5: Build frontend
log "Building frontend application..."
cd frontend
if ! npm ci -q; then
    error "Frontend npm install failed"
fi
if ! npm run build -q; then
    error "Frontend build failed"
fi
log "Frontend build completed successfully"

# Step 6: Copy frontend to backend
log "Integrating frontend with backend..."
cd ..
cp -r frontend/build src/main/resources/static/

# Step 7: Rebuild JAR
log "Rebuilding JAR with integrated frontend..."
if ! mvn clean package -DskipTests -q; then
    error "Final JAR build failed"
fi
log "JAR built successfully"

# Step 8: Setup systemd service
log "Setting up systemd service..."
cp ekart.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable ekart

# Step 9: Restart application
log "Restarting application..."
systemctl restart ekart

# Step 10: Verify deployment
log "Verifying deployment..."
sleep 5
if systemctl is-active --quiet ekart; then
    log "✅ Application is running"
else
    error "Application failed to start"
fi

# Step 11: Check health
log "Checking application health..."
if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
    log "✅ Application health check passed"
else
    warn "Could not verify application health"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo "=========================================="
echo "Application URL: http://localhost:8080"
echo "Logs: journalctl -u ekart -f"
echo "Status: systemctl status ekart"
echo ""
