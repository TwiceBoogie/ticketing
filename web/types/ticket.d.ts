import { FieldError } from "./auth";

export interface ITicketResponse {
  id: string;
  title: string;
  price: number;
}

export interface ITicketErrorResponse {
  errors: FieldError[];
}
