import { FieldError } from "./common";

export interface ITicketResponse {
  id: string;
  title: string;
  price: number;
}

export interface ITicketErrorResponse {
  errors: FieldError[];
}

export interface ITicket {
  id: string;
  title: string;
  price: string;
  userId: string;
}
