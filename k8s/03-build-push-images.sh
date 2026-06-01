#!/bin/bash

# Configuration
DOCKER_REGISTRY="docker.io"
DOCKERHUB_USERNAME="your-dockerhub-username"
FRONTEND_IMAGE="$DOCKER_REGISTRY/$DOCKERHUB_USERNAME/mern-frontend"
BACKEND_IMAGE="$DOCKER_REGISTRY/$DOCKERHUB_USERNAME/mern-backend"
VERSION="v1.0.0"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Building and pushing Docker images...${NC}"

# Build and push backend
echo -e "${YELLOW}Building backend image...${NC}"
cd ../backend
docker build -t $BACKEND_IMAGE:$VERSION \
  -t $BACKEND_IMAGE:latest \
  -f Dockerfile .

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Backend image built successfully!${NC}"
  
  echo -e "${YELLOW}Pushing backend image to Docker Hub...${NC}"
  docker push $BACKEND_IMAGE:$VERSION
  docker push $BACKEND_IMAGE:latest
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Backend image pushed successfully!${NC}"
  else
    echo -e "${RED}Failed to push backend image${NC}"
    exit 1
  fi
else
  echo -e "${RED}Failed to build backend image${NC}"
  exit 1
fi

# Build and push frontend
echo -e "${YELLOW}Building frontend image...${NC}"
cd ../frontend
docker build -t $FRONTEND_IMAGE:$VERSION \
  -t $FRONTEND_IMAGE:latest \
  -f Dockerfile .

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Frontend image built successfully!${NC}"
  
  echo -e "${YELLOW}Pushing frontend image to Docker Hub...${NC}"
  docker push $FRONTEND_IMAGE:$VERSION
  docker push $FRONTEND_IMAGE:latest
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Frontend image pushed successfully!${NC}"
  else
    echo -e "${RED}Failed to push frontend image${NC}"
    exit 1
  fi
else
  echo -e "${RED}Failed to build frontend image${NC}"
  exit 1
fi

echo -e "${GREEN}All images built and pushed successfully!${NC}"
echo -e "${YELLOW}Images ready for deployment:${NC}"
echo "  Backend: $BACKEND_IMAGE:$VERSION"
echo "  Frontend: $FRONTEND_IMAGE:$VERSION"
