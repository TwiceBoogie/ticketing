# Ticket Event Microservice App (Work in Progress)

This is a microservice-based application for managing events and ticket sales. The application is built using TypeScript and consists of the following services;

- **Api-gateway service**: This service is responsible for routing user requests to the appropriate backend service.
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

### With Docker And Skaffold

- Clone repo.
- Make sure you have Docker [installed locally](https://docs.docker.com/engine/install/).
- Make sure you have Skaffold [installed locally](https://skaffold.dev/docs/install/)
- Make sure you have [Ingress-Nginx Controller installed](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start) _(Note: we are using Kubernetes/ingress-nginx and not Kubernetes-ingress, if you are looking for documentation)_
- Once you have confirmed that ingress-nginx controller is installed, you need to identify if port 80 is running and shut it down (from other apps).
- Make sure to run `kubectl create secret generic my-secret --from-literal=JWT_KEY=<Your secret key>`, if you don't do this the app will crash.
- Make a small configuration change on your computer to your host file to make an additional routing rules. Add `127.0.0.1 ticketing.dev` into your host file.
<table>
<tr>
<th>Windows</th>
<th>Mac</th>
</tr>
<tr>
<td>
C:\Windows\System32\Drivers\etc\hosts
</td>
<td>
/etc/hosts
</td>
</tr>
</table>

- Make sure you are inside the project root directory and run `skaffold run`, Skaffold will orchestrate the build and deployment process for you.
- :coffee: time... It might take some time for the app to setup in the first skaffold run.
- Open <http://ticketing.dev> in your browser.
- Enjoy!
