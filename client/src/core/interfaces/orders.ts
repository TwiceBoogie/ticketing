import { Ticket } from "@/core";

export type Order = {
  id: number;
  expiresAt: string;
  status: string;
  ticket: Ticket;
};

export type TransformOrder = {
  id: number;
  status: string;
  expiresAt: string;
  ticketId: number;
  title: string;
  price: number;
};
