#!/bin/bash
# Comprehensive configuration script for MERN GRID CLUSTER deployment

set -e

# Configuration variables
export PROJECT_ID="your-gcp-project-id"
export CLUSTER_NAME="mern-gke-cluster"
export REGION="us-central1"
export ZONE="us-central1-a"
export NAMESPACE="mern-app"
export DOCKERHUB_USERNAME="your-dockerhub-username"
export DOCKERHUB_PASSWORD="your-dockerhub-password"
export DOCKERHUB_EMAIL="your-email@example.com"

# Application configuration
export ADMIN_EMAIL="admin@mern-app.com"
export ADMIN_PASSWORD="YOUR_SECURE_ADMIN_PASSWORD"
export JWT_SECRET="your-super-secure-jwt-secret"
export MONGO_PASSWORD="YOUR_SECURE_MONGO_PASSWORD"
export MONGO_URI="mongodb+srv://mern_user:${MONGO_PASSWORD}@clustergrud.wkf8ntf.mongodb.net/mern_db"

# Domain configuration
export DOMAIN_NAME="mern-app.com"
export API_DOMAIN="api.mern-app.com"
export FRONTEND_URL="https://${DOMAIN_NAME}"
export BACKEND_URL="http://mern-backend-service.${NAMESPACE}.svc.cluster.local:5000"

# Cluster configuration
export NUM_NODES=3
export MIN_NODES=3
export MAX_NODES=10
export MACHINE_TYPE="n1-standard-2"
export DISK_SIZE=50

# HPA configuration
export BACKEND_MIN_REPLICAS=3
export BACKEND_MAX_REPLICAS=10
export BACKEND_CPU_THRESHOLD=70
export BACKEND_MEMORY_THRESHOLD=80

export FRONTEND_MIN_REPLICAS=3
export FRONTEND_MAX_REPLICAS=8
export FRONTEND_CPU_THRESHOLD=80
export FRONTEND_MEMORY_THRESHOLD=85

# MongoDB configuration
export MONGO_REPLICAS=3
export MONGO_STORAGE_SIZE="10Gi"
export MONGO_MEMORY_REQUEST="512Mi"
export MONGO_MEMORY_LIMIT="2Gi"
export MONGO_CPU_REQUEST="250m"
export MONGO_CPU_LIMIT="1000m"

# Backup and disaster recovery
export BACKUP_ENABLED=true
export BACKUP_SCHEDULE="0 2 * * *"  # Daily at 2 AM
export BACKUP_RETENTION_DAYS=7
export GCS_BUCKET="mern-app-backups-${PROJECT_ID}"

# SSL/TLS configuration
export CERT_EMAIL="admin@${DOMAIN_NAME}"
export LETSENCRYPT_ENV="prod"  # Use "staging" for testing

# Monitoring and logging
export PROMETHEUS_RETENTION="24h"
export GRAFANA_ADMIN_PASSWORD="YOUR_SECURE_GRAFANA_PASSWORD"
export LOG_LEVEL="info"
export LOG_RETENTION_DAYS=7

# Export all configurations
export CONFIG_FILE="$(dirname "$0")/config.env"

echo "Configuration file created at: $CONFIG_FILE"
echo "Please review and update all values before deploying!"
