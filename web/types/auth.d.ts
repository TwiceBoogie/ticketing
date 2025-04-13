export interface ICsrfTokenData {
  csrf_token: string;
}

export interface ICurrentUser {
  id: string;
  email: string;
}

export interface IAuthResponse extends ICurrentUser {}

export interface FieldError {
  field: string;
  message: string;
}

export interface IAuthErrorResponse {
  errors: FieldError[];
}

export type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };
