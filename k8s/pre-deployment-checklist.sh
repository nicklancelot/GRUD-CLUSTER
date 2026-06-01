#!/bin/bash
set -e

# Load configuration
source config.env

# Colors
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}================================${NC}"
echo -e "${YELLOW}MERN GRID CLUSTER Pre-deployment Checklist${NC}"
echo -e "${YELLOW}================================${NC}"
echo ""

# Check GCP Configuration
echo -e "${YELLOW}[1] Checking GCP Configuration...${NC}"
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}✗ PROJECT_ID not set${NC}"
    exit 1
else
    echo -e "${GREEN}✓ PROJECT_ID: $PROJECT_ID${NC}"
fi

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}✗ gcloud CLI not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✓ gcloud CLI installed${NC}"
fi

# Check if kubectl is installed
echo -e "${YELLOW}[2] Checking Kubernetes Tools...${NC}"
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}✗ kubectl not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✓ kubectl installed$(kubectl version --client --short)${NC}"
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Docker installed$(docker --version)${NC}"
fi

# Check if Helm is installed
if ! command -v helm &> /dev/null; then
    echo -e "${RED}✗ Helm not installed${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Helm installed$(helm version --short)${NC}"
fi

# Check Docker Hub credentials
echo -e "${YELLOW}[3] Checking Docker Hub Access...${NC}"
if [ -z "$DOCKERHUB_USERNAME" ]; then
    echo -e "${RED}✗ DOCKERHUB_USERNAME not set${NC}"
    exit 1
else
    echo -e "${GREEN}✓ DOCKERHUB_USERNAME: $DOCKERHUB_USERNAME${NC}"
fi

# Check GCP authentication
echo -e "${YELLOW}[4] Checking GCP Authentication...${NC}"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo -e "${RED}✗ GCP authentication failed${NC}"
    exit 1
else
    ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
    echo -e "${GREEN}✓ Authenticated as: $ACCOUNT${NC}"
fi

# Check if GKE cluster exists
echo -e "${YELLOW}[5] Checking GKE Cluster...${NC}"
if gcloud container clusters describe $CLUSTER_NAME --zone=$ZONE --project=$PROJECT_ID &> /dev/null; then
    echo -e "${GREEN}✓ Cluster $CLUSTER_NAME exists${NC}"
else
    echo -e "${YELLOW}⚠ Cluster $CLUSTER_NAME does not exist - will be created${NC}"
fi

# Check Kubernetes configuration
echo -e "${YELLOW}[6] Checking Kubernetes Configuration...${NC}"
if [ -f "$HOME/.kube/config" ]; then
    echo -e "${GREEN}✓ kubeconfig found${NC}"
    CONTEXTS=$(kubectl config get-contexts --output=name 2>/dev/null | wc -l)
    echo -e "${GREEN}✓ Available contexts: $CONTEXTS${NC}"
else
    echo -e "${YELLOW}⚠ kubeconfig not found - will be created${NC}"
fi

# Check MongoDB configuration
echo -e "${YELLOW}[7] Checking MongoDB Configuration...${NC}"
if [ -z "$MONGO_PASSWORD" ] || [ "$MONGO_PASSWORD" = "YOUR_SECURE_MONGO_PASSWORD" ]; then
    echo -e "${RED}✗ MONGO_PASSWORD not properly configured${NC}"
    exit 1
else
    echo -e "${GREEN}✓ MONGO_PASSWORD configured${NC}"
fi

# Check JWT Secret configuration
echo -e "${YELLOW}[8] Checking Security Configuration...${NC}"
if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your-super-secure-jwt-secret-change-this" ]; then
    echo -e "${RED}✗ JWT_SECRET not properly configured${NC}"
    exit 1
else
    echo -e "${GREEN}✓ JWT_SECRET configured${NC}"
fi

# Check required Kubernetes resources
echo -e "${YELLOW}[9] Checking Kubernetes YAML files...${NC}"
REQUIRED_FILES=(
    "namespace.yaml"
    "configmap.yaml"
    "secrets.yaml"
    "mongodb-statefulset.yaml"
    "backend-deployment.yaml"
    "frontend-deployment.yaml"
    "services.yaml"
    "ingress.yaml"
    "hpa.yaml"
    "pdb.yaml"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ Found: $file${NC}"
    else
        echo -e "${RED}✗ Missing: $file${NC}"
        exit 1
    fi
done

# Check Docker image availability
echo -e "${YELLOW}[10] Checking Docker Images...${NC}"
if docker images | grep -q "$DOCKERHUB_USERNAME/mern-backend"; then
    echo -e "${GREEN}✓ Backend image found locally${NC}"
else
    echo -e "${YELLOW}⚠ Backend image not found locally - will be built/pulled${NC}"
fi

if docker images | grep -q "$DOCKERHUB_USERNAME/mern-frontend"; then
    echo -e "${GREEN}✓ Frontend image found locally${NC}"
else
    echo -e "${YELLOW}⚠ Frontend image not found locally - will be built/pulled${NC}"
fi

# Check Disk space
echo -e "${YELLOW}[11] Checking Disk Space...${NC}"
AVAILABLE_SPACE=$(df /tmp | awk 'NR==2 {print $4}')
if [ "$AVAILABLE_SPACE" -gt 5242880 ]; then
    echo -e "${GREEN}✓ Sufficient disk space available${NC}"
else
    echo -e "${YELLOW}⚠ Low disk space available ($(numfmt --to=iec-i --suffix=B $AVAILABLE_SPACE))${NC}"
fi

# Check Network connectivity
echo -e "${YELLOW}[12] Checking Network Connectivity...${NC}"
if ping -c 1 8.8.8.8 &> /dev/null; then
    echo -e "${GREEN}✓ Internet connectivity OK${NC}"
else
    echo -e "${RED}✗ No internet connectivity${NC}"
    exit 1
fi

# Display summary
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ All Pre-deployment Checks Passed!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${YELLOW}Configuration Summary:${NC}"
echo "  Project ID: $PROJECT_ID"
echo "  Cluster: $CLUSTER_NAME"
echo "  Region: $REGION"
echo "  Namespace: $NAMESPACE"
echo "  Docker Hub User: $DOCKERHUB_USERNAME"
echo "  Domain: $DOMAIN_NAME"
echo "  MongoDB Replicas: $MONGO_REPLICAS"
echo "  Backend Replicas: $BACKEND_REPLICAS"
echo "  Frontend Replicas: $FRONTEND_REPLICAS"
echo ""
echo -e "${YELLOW}Ready to deploy! Next steps:${NC}"
echo "  1. Review the configuration in config.env"
echo "  2. Run: make setup (or bash 01-create-gke-cluster.sh)"
echo "  3. Run: make deploy (or bash 02-deploy-to-gke.sh)"
echo "  4. Monitor: make diagnose"
