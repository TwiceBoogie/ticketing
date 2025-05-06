# Ticket Event Microservice App

This is a microservice-based application for managing events and ticket sales. The application is built using TypeScript and consists of the following services;

- **Auth service**: This service handles user authentication and authorization.
- **Client service** (Next.js): This service provides a web-based user interface for interacting with the application.
- **Expiration service**: This service is responsible for managing the expiration of tickets that are reserved but not - purchased.
- **Order service**: This service handles the creation and management of ticket orders.
- **Ticket service**: This service is responsible for managing ticket inventory and publishing ticket events.
- **Payment service**: This service handles payment processing.

## Technology Stack and Requirements

- [TypeScript](https://www.typescriptlang.org) language
- [NodeJs](https://nodejs.org) / [express](https://expressjs.com/)
- [MongoDb](https://www.mongodb.com/) / [Mongoose](https://mongoosejs.com/)
- [NextJs](https://nextjs.org/)

## Quick Start

> ❗ **Required:** Install the [Stripe Cli](https://docs.stripe.com/stripe-cli)\
> You must have Stripe cli downloaded locally in order for the project to work properly and run `stripe login`

### Running locally

> **Note:** \
> The `web` (Next.js) app uses port 3000, so payments is exposed on 3003 to avoid conflict. Same goes for other services.

```
$ git clone https://github.com/TwiceBoogie/ticketing.git

$ cd ticketing/

$ docker compose up -d

$ yarn install

$ yarn build --filter=@twicetickets/common

# copy and paste the whsec_ string into payments/.env
$ stripe listen --forward-to localhost:3003/api/payments/webhook

$ chmod +x setup.sh && ./setup.sh # fill out .env files on each service

$ yarn dev
```

### Running with Docker And Kubernetes

> ❗ **Required:** Install [Ingress-Nginx Controller](https://kubernetes.github.io/ingress-nginx/deploy/) \
> Must have this as your reverse proxy so request can be forwarded to the correct service.

> **Note:** Install [Skaffold](https://skaffold.dev/docs/install/) (optional) \
> Skaffold is optional, I only use it to have all logs aggregated in 1 spot
> and to build images and apply kubernetes files with 1 command `skaffold dev`

```
$ git clone https://github.com/TwiceBoogie/ticketing.git

$ cd ticketing/

# copy and paste the whsec_ string into infra/k8s/stripe_secret.yaml
$ stripe listen --forward-to localhost:3000/api/payments/webhook

$ chmod +x setup.sh && ./setup.sh # fill out infra/k8s/{jwt/stripe-secret.yaml} files

$ skaffold dev

$ kubectl port-forward svc/payments-srv 3000:3000 --namespace=development
```

- Make a small configuration change on your computer to your host file to make an additional routing rules. Add `127.0.0.1 ticketing.app` into your host file.
