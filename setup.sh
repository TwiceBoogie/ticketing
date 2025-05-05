#!/bin/bash

set -e

echo "Setting up .env files from .env.local..."

SERVICES=("auth", "tickets", "orders", "payments", "expiration")

for dir in "${SERVICES[@]}"; do
    src="./$dir/.env.local"
    dest="./$dir/.env"

    if [-f "$src"]; then
        if [-f "$dest"]; then
            echo "$dest already exists, skipping..."
        else
            cp "$src" "$dest"
            echo "Created $dest"
        fi
    else
        echo "No .env.local found in $dir - skipping"
    fi
done

echo "Done! You can now fill the .env files inside each service."