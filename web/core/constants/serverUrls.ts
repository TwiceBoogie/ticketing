export const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL ?? "http://localhost:3001",
  orders: process.env.ORDERS_SERVICE_URL ?? "http://localhost:3002",
  payments: process.env.PAYMENTS_SERVICE_URL ?? "http://localhost:3003",
  tickets: process.env.TICKET_SERVICE_URL ?? "http://localhost:3004",
};
