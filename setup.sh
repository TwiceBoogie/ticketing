#!/bin/bash

set -e

echo "Setting up .env files from .env.local..."

SERVICES=("auth" "tickets" "orders" "payments" "expiration")

for dir in "${SERVICES[@]}"; do
    src="./$dir/.env.local"
    dest="./$dir/.env"

    if [ -f "$src" ]; then
        if [ -f "$dest" ]; then
            echo "$dest already exists, skipping..."
        else
            cp "$src" "$dest"
            echo "Created $dest"
        fi
    else
        echo "No .env.local found in $dir - skipping"
    fi
done

echo "Setting up Kubernetes secrets manifest..."

SECRETS=("jwt-secret" "stripe-secret")

for secret in "${SECRETS[@]}"; do
    src="infra/k8s/${secret}.yaml.local"
    dest="infra/k8s/${secret}.yaml"

    if [ -f "$src" ]; then
        if [ -f "$dest" ]; then
            echo "$dest already exists, skipping..."
        else
            cp "$src" "$dest"
            echo "Created $dest"
        fi
    else
        echo "Missing $src - skipping"
    fi
done

echo "All setup complete. Edit your .env files on each service and fill in the jwt-secret/stripe-secret.yaml files."