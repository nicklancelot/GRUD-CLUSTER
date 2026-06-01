#!/bin/bash

# Configuration
NAMESPACE="mern-app"
BACKEND_DEPLOYMENT="mern-backend"
FRONTEND_DEPLOYMENT="mern-frontend"
NEW_VERSION="v1.0.1"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Checking deployment status before update...${NC}"
kubectl rollout status deployment/$BACKEND_DEPLOYMENT -n $NAMESPACE --timeout=5m
kubectl rollout status deployment/$FRONTEND_DEPLOYMENT -n $NAMESPACE --timeout=5m

echo -e "${YELLOW}Performing blue-green deployment (rolling update)...${NC}"

# Update backend image
echo -e "${YELLOW}Updating backend deployment with new image...${NC}"
kubectl set image deployment/$BACKEND_DEPLOYMENT \
  backend=YOUR_DOCKERHUB_USERNAME/mern-backend:$NEW_VERSION \
  -n $NAMESPACE

# Monitor rollout
echo -e "${YELLOW}Monitoring backend rollout...${NC}"
kubectl rollout status deployment/$BACKEND_DEPLOYMENT -n $NAMESPACE --timeout=10m

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Backend deployment updated successfully!${NC}"
else
  echo -e "${RED}Backend deployment update failed!${NC}"
  echo -e "${YELLOW}Rolling back backend deployment...${NC}"
  kubectl rollout undo deployment/$BACKEND_DEPLOYMENT -n $NAMESPACE
  exit 1
fi

# Update frontend image
echo -e "${YELLOW}Updating frontend deployment with new image...${NC}"
kubectl set image deployment/$FRONTEND_DEPLOYMENT \
  frontend=YOUR_DOCKERHUB_USERNAME/mern-frontend:$NEW_VERSION \
  -n $NAMESPACE

# Monitor rollout
echo -e "${YELLOW}Monitoring frontend rollout...${NC}"
kubectl rollout status deployment/$FRONTEND_DEPLOYMENT -n $NAMESPACE --timeout=10m

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Frontend deployment updated successfully!${NC}"
else
  echo -e "${RED}Frontend deployment update failed!${NC}"
  echo -e "${YELLOW}Rolling back frontend deployment...${NC}"
  kubectl rollout undo deployment/$FRONTEND_DEPLOYMENT -n $NAMESPACE
  exit 1
fi

echo -e "${GREEN}Blue-green deployment completed successfully!${NC}"

# Get pod status
echo -e "${YELLOW}Current pod status:${NC}"
kubectl get pods -n $NAMESPACE -l app=mern-backend
kubectl get pods -n $NAMESPACE -l app=mern-frontend
