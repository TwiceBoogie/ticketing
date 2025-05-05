export type Result<T, E> = { ok: true; data: T; cookieHeader: string } | { ok: false; error: E };

export interface FieldError {
  field: string;
  message: string;
}

export type GeneralError = {
  field?: string;
  message: string;
};

export type TAPIResponse<T> = { ok: true; data: T } | { ok: false; errors: GeneralError[] };
