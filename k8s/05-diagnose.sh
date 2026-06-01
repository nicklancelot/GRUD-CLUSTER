#!/bin/bash

# Configuration
NAMESPACE="mern-app"
CLUSTER_NAME="mern-gke-cluster"
REGION="us-central1"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== MERN Application Status and Diagnostics ===${NC}"

echo -e "${YELLOW}Cluster Information:${NC}"
kubectl cluster-info

echo -e "${YELLOW}Nodes:${NC}"
kubectl get nodes -o wide

echo -e "${YELLOW}Namespace: $NAMESPACE${NC}"
kubectl get namespace $NAMESPACE

echo -e "${YELLOW}Deployments:${NC}"
kubectl get deployments -n $NAMESPACE -o wide

echo -e "${YELLOW}StatefulSets:${NC}"
kubectl get statefulsets -n $NAMESPACE -o wide

echo -e "${YELLOW}Pods:${NC}"
kubectl get pods -n $NAMESPACE -o wide

echo -e "${YELLOW}Services:${NC}"
kubectl get services -n $NAMESPACE -o wide

echo -e "${YELLOW}Ingress:${NC}"
kubectl get ingress -n $NAMESPACE -o wide

echo -e "${YELLOW}HorizontalPodAutoscalers:${NC}"
kubectl get hpa -n $NAMESPACE -o wide

echo -e "${YELLOW}PersistentVolumes:${NC}"
kubectl get pv -n $NAMESPACE

echo -e "${YELLOW}PersistentVolumeClaims:${NC}"
kubectl get pvc -n $NAMESPACE -o wide

echo -e "${YELLOW}ConfigMaps:${NC}"
kubectl get configmaps -n $NAMESPACE

echo -e "${YELLOW}Secrets:${NC}"
kubectl get secrets -n $NAMESPACE

echo -e "${YELLOW}Network Policies:${NC}"
kubectl get networkpolicies -n $NAMESPACE

echo -e "${YELLOW}Resource Quotas:${NC}"
kubectl get resourcequotas -n $NAMESPACE

echo -e "${YELLOW}Events:${NC}"
kubectl get events -n $NAMESPACE --sort-by='.lastTimestamp' | tail -20

echo -e "${YELLOW}Backend Pod Logs (last 50 lines):${NC}"
BACKEND_POD=$(kubectl get pods -n $NAMESPACE -l app=mern-backend -o jsonpath='{.items[0].metadata.name}')
if [ -n "$BACKEND_POD" ]; then
  kubectl logs -n $NAMESPACE $BACKEND_POD --tail=50
fi

echo -e "${YELLOW}Frontend Pod Logs (last 50 lines):${NC}"
FRONTEND_POD=$(kubectl get pods -n $NAMESPACE -l app=mern-frontend -o jsonpath='{.items[0].metadata.name}')
if [ -n "$FRONTEND_POD" ]; then
  kubectl logs -n $NAMESPACE $FRONTEND_POD --tail=50
fi

echo -e "${YELLOW}MongoDB Pod Logs (last 50 lines):${NC}"
MONGO_POD=$(kubectl get pods -n $NAMESPACE -l app=mongodb -o jsonpath='{.items[0].metadata.name}')
if [ -n "$MONGO_POD" ]; then
  kubectl logs -n $NAMESPACE $MONGO_POD --tail=50
fi

echo -e "${YELLOW}Resource Usage:${NC}"
kubectl top nodes
echo -e ""
kubectl top pods -n $NAMESPACE

echo -e "${GREEN}Diagnostics completed!${NC}"
