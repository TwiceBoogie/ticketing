#!/bin/bash

set -e

NAMESPACE="development"

# check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker does not appear to be running. Please start Docker"
    exit 1
fi

echo "Building Docker images manually..."

SERVICES=("auth" "tickets" "orders" "payments" "expiration" "web")

for dir in "${SERVICES[@]}"; do
    tags="twiceboogie13/$dir"

    # rename web to client
    if [ "$dir" == "web" ]; then
        tag="twiceboogie13/client"
    fi

    echo "Building image for $dir -> $tag:latest"
    docker build -t "$tag:latest" -f "$dir/Dockerfile" .
done

echo "Docker image build complete"

# if kubernetest namespace doesn't exist, create
if ! kubectl get namespace "$NAMESPACE" > /dev/null 2>&1; then
    echo "Namespace '$NAMESPACE' does not exist. Creating..."
    kubectl create namespace "$NAMESPACE"
else
    echo "Namespace '$NAMESPACE' exists, skipping"
fi

echo "Applying Kubernetest manifest to namespace '$NAMESPACE'..."
kubectl apply -n "$NAMESPACE" -f infra/k8s/

echo "Deployment complete. You can now run 'stripe listen --forward-to localhost:3000/api/payments/webhook'"