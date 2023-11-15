import { Ticket } from "@/core";

export type Order = {
  id: number;
  expiresAt: string;
  status: string;
  ticket: Ticket;
  createdAt: string;
};

export type TransformOrder = {
  id: number;
  status: string;
  expiresAt: string;
  ticketId: string;
  title: string;
  price: number;
  createdAt: string;
};
