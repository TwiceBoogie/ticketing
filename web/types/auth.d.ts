import { FieldError } from "./common";

export interface ICsrfTokenData {
  csrf_token: string;
}

export interface ICurrentUser {
  id: string;
  email: string;
}

interface ICurrentUserResponse {
  currentUser: ICurrentUser | null;
}

export interface IAuthResponse extends ICurrentUser {}

export interface IAuthErrorResponse {
  errors: FieldError[];
}
