// Service endpoints
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL ?? "http://localhost:3001";
const ORDERS_SERVICE = process.env.ORDERS_SERVICE_URL ?? "http://localhost:3002";
const PAYMENTS_SERVICE = process.env.PAYMENTS_SERVICE_URL ?? "http://localhost:3003";
const TICKETS_SERVICE = process.env.TICKETS_SERVICE_URL ?? "http://localhost:3004";
// api endpoints
const API_AUTH_ENDPOINT = `${AUTH_SERVICE}/api/users`;
const API_ORDER_ENDPOINT = `${ORDERS_SERVICE}/api/orders`;
// Auth-Service
export const API_AUTH_LOGIN = `${API_AUTH_ENDPOINT}/signin`;
export const API_AUTH_REGISTER = `${API_AUTH_ENDPOINT}/signup`;
export const API_AUTH_LOGOUT = `${API_AUTH_ENDPOINT}/signout`;
export const API_AUTH_CURRENTUSER = `${API_AUTH_ENDPOINT}/currentuser`;
// Order-Servce
export const API_ORDERS_GET = API_ORDER_ENDPOINT;
export const API_ORDERS_POST = API_ORDER_ENDPOINT;
export const API_ORDERS_DELETE = (orderId: string) => {
  return `${API_ORDER_ENDPOINT}/${orderId}`;
};
export const API_ORDER_SHOW = (orderId: string) => {
  return `${API_ORDER_ENDPOINT}/${orderId}`;
};
