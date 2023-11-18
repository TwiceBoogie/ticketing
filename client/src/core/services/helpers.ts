import { Stripe, loadStripe } from "@stripe/stripe-js";
import { Order } from "..";

type Cookie = {
  jwt: string;
  path: string;
  expires: string;
  httponly?: boolean;
};

export function generateRandomKey(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    key += characters.charAt(randomIndex);
  }
  return key;
}

export function transformOrder(order: Order) {
  return {
    id: order.id,
    status: order.status,
    expiresAt: order.expiresAt,
    ticketId: order.ticket.id,
    title: order.ticket.title,
    price: order.ticket.price,
    createdAt: order.createdAt,
  };
}

let stripePromise: Promise<Stripe | null>;
export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
}

export function parseCookieString(
  cookie: string
): Record<string, string | boolean> {
  const cookieObject: Record<string, string | boolean> = {};
  const cookiePairs = cookie.split(";");

  cookiePairs.forEach((pair) => {
    const firstEqualsIndex = pair.indexOf("=");
    if (firstEqualsIndex !== -1) {
      const key = pair.slice(0, firstEqualsIndex).trim();
      const value = pair.slice(firstEqualsIndex + 1).trim();
      cookieObject[key] = key === "httponly" ? true : value;
    }
  });

  return cookieObject;
}
