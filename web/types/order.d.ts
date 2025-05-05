import { TAPIResponse } from "./common";

export type Order = {
  id: string;
  userId: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  stripeCheckoutUrl: string;
  version: number;
  ticket: {
    id: string;
    title: string;
    price: number;
    version: number;
  };
};

export type FlattenedOrder = Omit<Order, "ticket"> & {
  ticketId: string;
  title: string;
  price: number;
  formattedCreatedAt: string;
  formattedExpiresAt: string;
};

export type OrderSuccessResponse = Order[];

export type OrderErrorResponse = {
  errors: {
    message: string;
  }[];
};

export type OrdersResponse = {
  status: number;
  orders: FlattenedOrder[];
};

export type OrderResponse = {
  status: number;
  order: Order;
};

export type TOrderAPIResponse = TAPIResponse<Order>;
