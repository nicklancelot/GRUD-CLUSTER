#!/bin/bash
set -e

# Configuration
PROJECT_ID="your-gcp-project-id"
CLUSTER_NAME="mern-gke-cluster"
REGION="us-central1"
ZONE="us-central1-a"
NUM_NODES=3
MACHINE_TYPE="n1-standard-2"
DISK_SIZE=50

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Creating GKE Cluster: $CLUSTER_NAME${NC}"

# Create GKE Cluster with HA configuration
gcloud container clusters create $CLUSTER_NAME \
  --project=$PROJECT_ID \
  --zone=$ZONE \
  --region=$REGION \
  --num-nodes=$NUM_NODES \
  --machine-type=$MACHINE_TYPE \
  --disk-size=$DISK_SIZE \
  --enable-autorepair \
  --enable-autoupgrade \
  --enable-autoscaling \
  --min-nodes=3 \
  --max-nodes=10 \
  --enable-vertical-pod-autoscaling \
  --enable-network-policy \
  --addons=HorizontalPodAutoscaling,HttpLoadBalancing,GcePersistentDiskCsiDriver \
  --workload-pool=$PROJECT_ID.svc.id.goog \
  --enable-stackdriver-kubernetes \
  --enable-ip-alias \
  --network="default" \
  --subnetwork="default" \
  --cluster-secondary-range-name="pods" \
  --services-secondary-range-name="services" \
  --enable-shielded-nodes \
  --enable-dns-access \
  --release-channel=rapid \
  --labels=environment=production,app=mern

echo -e "${GREEN}GKE Cluster created successfully!${NC}"

# Get cluster credentials
echo -e "${YELLOW}Configuring kubectl credentials...${NC}"
gcloud container clusters get-credentials $CLUSTER_NAME \
  --zone=$ZONE \
  --project=$PROJECT_ID

# Verify cluster connection
echo -e "${YELLOW}Verifying cluster connection...${NC}"
kubectl cluster-info
kubectl get nodes

echo -e "${GREEN}Cluster setup completed!${NC}"
