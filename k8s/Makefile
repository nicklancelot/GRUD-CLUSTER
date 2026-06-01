# Makefile for MERN GRID CLUSTER Deployment

.PHONY: help setup build push deploy delete logs diagnose scale rollback clean

# Configuration
PROJECT_ID ?= your-gcp-project-id
CLUSTER_NAME ?= mern-gke-cluster
REGION ?= us-central1
ZONE ?= us-central1-a
NAMESPACE ?= mern-app
DOCKERHUB_USERNAME ?= your-dockerhub-username
VERSION ?= v1.0.0

# Docker images
BACKEND_IMAGE = docker.io/$(DOCKERHUB_USERNAME)/mern-backend
FRONTEND_IMAGE = docker.io/$(DOCKERHUB_USERNAME)/mern-frontend

# Colors
YELLOW = \033[1;33m
GREEN = \033[0;32m
RED = \033[0;31m
NC = \033[0m

help:
	@echo "$(YELLOW)MERN GRID CLUSTER Kubernetes Deployment Targets:$(NC)"
	@echo ""
	@echo "Setup & Cluster Management:"
	@echo "  $(GREEN)make setup$(NC)              - Create GKE cluster and install dependencies"
	@echo "  $(GREEN)make delete-cluster$(NC)    - Delete GKE cluster"
	@echo "  $(GREEN)make get-credentials$(NC)   - Get GKE cluster credentials"
	@echo ""
	@echo "Build & Push:"
	@echo "  $(GREEN)make build$(NC)              - Build Docker images locally"
	@echo "  $(GREEN)make push$(NC)               - Push images to Docker Hub"
	@echo "  $(GREEN)make build-push$(NC)        - Build and push images"
	@echo ""
	@echo "Deployment:"
	@echo "  $(GREEN)make deploy$(NC)             - Deploy all components to K8s"
	@echo "  $(GREEN)make update$(NC)             - Update deployment with new image"
	@echo "  $(GREEN)make rollback$(NC)           - Rollback to previous deployment"
	@echo ""
	@echo "Monitoring & Debugging:"
	@echo "  $(GREEN)make logs-backend$(NC)      - Show backend pod logs"
	@echo "  $(GREEN)make logs-frontend$(NC)     - Show frontend pod logs"
	@echo "  $(GREEN)make logs-mongodb$(NC)      - Show MongoDB pod logs"
	@echo "  $(GREEN)make logs-all$(NC)          - Show all pod logs"
	@echo "  $(GREEN)make diagnose$(NC)          - Run diagnostics"
	@echo "  $(GREEN)make status$(NC)            - Show deployment status"
	@echo ""
	@echo "Scaling & Management:"
	@echo "  $(GREEN)make scale-backend N=5$(NC) - Scale backend to N replicas"
	@echo "  $(GREEN)make scale-frontend N=3$(NC) - Scale frontend to N replicas"
	@echo "  $(GREEN)make hpa-status$(NC)        - Show HPA status"
	@echo ""
	@echo "Cleanup:"
	@echo "  $(GREEN)make delete$(NC)            - Delete all deployments"
	@echo "  $(GREEN)make clean$(NC)             - Clean up local build artifacts"

# Setup & Cluster
setup:
	@echo "$(YELLOW)Setting up GKE cluster...$(NC)"
	@bash ./01-create-gke-cluster.sh
	@echo "$(YELLOW)Installing dependencies...$(NC)"
	@bash ./02-deploy-to-gke.sh

get-credentials:
	@echo "$(YELLOW)Getting GKE cluster credentials...$(NC)"
	@gcloud container clusters get-credentials $(CLUSTER_NAME) \
		--zone=$(ZONE) \
		--project=$(PROJECT_ID)

delete-cluster:
	@echo "$(RED)Deleting GKE cluster: $(CLUSTER_NAME)$(NC)"
	@read -p "Are you sure? (y/N) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		gcloud container clusters delete $(CLUSTER_NAME) \
			--zone=$(ZONE) \
			--project=$(PROJECT_ID); \
	fi

# Build & Push
build:
	@echo "$(YELLOW)Building Docker images...$(NC)"
	cd ../backend && docker build -t $(BACKEND_IMAGE):$(VERSION) -t $(BACKEND_IMAGE):latest -f Dockerfile .
	cd ../frontend && docker build -t $(FRONTEND_IMAGE):$(VERSION) -t $(FRONTEND_IMAGE):latest -f Dockerfile .
	@echo "$(GREEN)Images built successfully!$(NC)"

push: build
	@echo "$(YELLOW)Pushing Docker images to Docker Hub...$(NC)"
	docker push $(BACKEND_IMAGE):$(VERSION)
	docker push $(BACKEND_IMAGE):latest
	docker push $(FRONTEND_IMAGE):$(VERSION)
	docker push $(FRONTEND_IMAGE):latest
	@echo "$(GREEN)Images pushed successfully!$(NC)"

build-push: push

# Deployment
deploy:
	@echo "$(YELLOW)Deploying to Kubernetes...$(NC)"
	@bash ./02-deploy-to-gke.sh

delete:
	@echo "$(RED)Deleting all deployments from namespace: $(NAMESPACE)$(NC)"
	@read -p "Are you sure? (y/N) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		kubectl delete namespace $(NAMESPACE); \
	fi

update:
	@echo "$(YELLOW)Updating deployment with new image version...$(NC)"
	@bash ./04-update-deployment.sh

rollback:
	@echo "$(YELLOW)Rolling back deployments...$(NC)"
	kubectl rollout undo deployment/mern-backend -n $(NAMESPACE)
	kubectl rollout undo deployment/mern-frontend -n $(NAMESPACE)
	@echo "$(GREEN)Rollback completed!$(NC)"

# Logging
logs-backend:
	@kubectl logs -f deployment/mern-backend -n $(NAMESPACE) --all-containers=true

logs-frontend:
	@kubectl logs -f deployment/mern-frontend -n $(NAMESPACE) --all-containers=true

logs-mongodb:
	@kubectl logs -f statefulset/mongodb -n $(NAMESPACE) --all-containers=true

logs-all:
	@kubectl logs -f -n $(NAMESPACE) -l app=mern-backend,app=mern-frontend,app=mongodb --prefix=true

# Monitoring & Debugging
diagnose:
	@echo "$(YELLOW)Running diagnostics...$(NC)"
	@bash ./05-diagnose.sh

status:
	@echo "$(YELLOW)Deployment Status:$(NC)"
	@kubectl get deployments -n $(NAMESPACE) -o wide
	@echo ""
	@echo "$(YELLOW)Pod Status:$(NC)"
	@kubectl get pods -n $(NAMESPACE) -o wide
	@echo ""
	@echo "$(YELLOW)Service Status:$(NC)"
	@kubectl get services -n $(NAMESPACE) -o wide
	@echo ""
	@echo "$(YELLOW)HPA Status:$(NC)"
	@kubectl get hpa -n $(NAMESPACE) -o wide

# Scaling
scale-backend:
	@echo "$(YELLOW)Scaling backend to $(N) replicas...$(NC)"
	@kubectl scale deployment mern-backend -n $(NAMESPACE) --replicas=$(N)

scale-frontend:
	@echo "$(YELLOW)Scaling frontend to $(N) replicas...$(NC)"
	@kubectl scale deployment mern-frontend -n $(NAMESPACE) --replicas=$(N)

hpa-status:
	@kubectl get hpa -n $(NAMESPACE) -o wide
	@echo ""
	@kubectl describe hpa -n $(NAMESPACE)

# Cleanup
clean:
	@echo "$(YELLOW)Cleaning up local build artifacts...$(NC)"
	@docker rmi -f $(BACKEND_IMAGE):$(VERSION) $(BACKEND_IMAGE):latest 2>/dev/null || true
	@docker rmi -f $(FRONTEND_IMAGE):$(VERSION) $(FRONTEND_IMAGE):latest 2>/dev/null || true
	@echo "$(GREEN)Cleanup completed!$(NC)"

# Port Forwarding
port-forward-backend:
	@echo "$(YELLOW)Forwarding port 5000 to backend...$(NC)"
	@kubectl port-forward -n $(NAMESPACE) svc/mern-backend-service 5000:5000

port-forward-frontend:
	@echo "$(YELLOW)Forwarding port 3000 to frontend...$(NC)"
	@kubectl port-forward -n $(NAMESPACE) svc/mern-frontend-service 3000:80

port-forward-mongodb:
	@echo "$(YELLOW)Forwarding port 27017 to MongoDB...$(NC)"
	@kubectl port-forward -n $(NAMESPACE) svc/mongodb 27017:27017

# Exec into pods
exec-backend:
	@kubectl exec -it deployment/mern-backend -n $(NAMESPACE) -- /bin/bash

exec-frontend:
	@kubectl exec -it deployment/mern-frontend -n $(NAMESPACE) -- /bin/sh

exec-mongodb:
	@kubectl exec -it statefulset/mongodb -n $(NAMESPACE) -- mongosh

# Verify resources
verify:
	@echo "$(YELLOW)Verifying deployment resources...$(NC)"
	@kubectl api-resources -n $(NAMESPACE)
	@echo ""
	@echo "$(YELLOW)Resource Usage:$(NC)"
	@kubectl top nodes
	@echo ""
	@kubectl top pods -n $(NAMESPACE)
