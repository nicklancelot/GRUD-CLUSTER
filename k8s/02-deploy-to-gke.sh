#!/bin/bash
set -e

# Configuration
PROJECT_ID="your-gcp-project-id"
DOCKERHUB_USERNAME="your-dockerhub-username"
DOCKERHUB_PASSWORD="your-dockerhub-password"
DOCKERHUB_EMAIL="your-email@example.com"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Installing NGINX Ingress Controller...${NC}"
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer \
  --set controller.metrics.enabled=true \
  --set controller.resources.requests.cpu=100m \
  --set controller.resources.requests.memory=128Mi \
  --wait

echo -e "${GREEN}NGINX Ingress Controller installed!${NC}"

echo -e "${YELLOW}Installing Cert-Manager...${NC}"
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.14.0 \
  --set installCRDs=true \
  --wait

echo -e "${GREEN}Cert-Manager installed!${NC}"

echo -e "${YELLOW}Installing Prometheus & Grafana...${NC}"
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --values - <<EOF
prometheus:
  prometheusSpec:
    retention: 24h
    resources:
      requests:
        cpu: 200m
        memory: 256Mi
      limits:
        cpu: 500m
        memory: 512Mi
grafana:
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 200m
      memory: 256Mi
EOF

echo -e "${GREEN}Prometheus & Grafana installed!${NC}"

echo -e "${YELLOW}Creating Docker Registry Secret...${NC}"
kubectl create secret docker-registry dockerhub-secret \
  --docker-server=docker.io \
  --docker-username=$DOCKERHUB_USERNAME \
  --docker-password=$DOCKERHUB_PASSWORD \
  --docker-email=$DOCKERHUB_EMAIL \
  --namespace=mern-app \
  --dry-run=client -o yaml | kubectl apply -f -

echo -e "${GREEN}Docker Registry Secret created!${NC}"

echo -e "${YELLOW}Creating mern-app namespace...${NC}"
kubectl apply -f namespace.yaml

echo -e "${YELLOW}Deploying ConfigMaps and Secrets...${NC}"
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml

echo -e "${YELLOW}Deploying MongoDB...${NC}"
kubectl apply -f mongodb-statefulset.yaml

# Wait for MongoDB to be ready
echo -e "${YELLOW}Waiting for MongoDB to be ready...${NC}"
kubectl wait --for=condition=ready pod -l app=mongodb -n mern-app --timeout=300s

echo -e "${YELLOW}Deploying Backend...${NC}"
kubectl apply -f backend-deployment.yaml

echo -e "${YELLOW}Deploying Frontend...${NC}"
kubectl apply -f frontend-deployment.yaml

echo -e "${YELLOW}Deploying Services and Ingress...${NC}"
kubectl apply -f services.yaml
kubectl apply -f ingress.yaml

echo -e "${YELLOW}Deploying HPA and PDB...${NC}"
kubectl apply -f hpa.yaml
kubectl apply -f pdb.yaml

echo -e "${YELLOW}Deploying Monitoring...${NC}"
kubectl apply -f monitoring.yaml

echo -e "${YELLOW}Deploying Logging...${NC}"
kubectl apply -f logging.yaml

echo -e "${GREEN}All deployments completed!${NC}"

echo -e "${YELLOW}Verifying deployments...${NC}"
kubectl get deployments -n mern-app
kubectl get statefulsets -n mern-app
kubectl get services -n mern-app
kubectl get ingress -n mern-app
kubectl get hpa -n mern-app
kubectl get pdb -n mern-app

echo -e "${GREEN}Deployment verification completed!${NC}"
