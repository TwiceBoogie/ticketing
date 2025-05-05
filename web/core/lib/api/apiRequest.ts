import { GeneralError, Result } from "@/types/common";

export async function apiRequest<T extends object>(url: string, init: RequestInit): Promise<Result<T, FieldError[]>> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    });

    if (res.status === 204) {
      return {
        ok: true,
        data: {} as T,
        cookieHeader: "",
      };
    }
    const data: T | { errors: GeneralError[] } = await res.json();
    if (res.status === 401 && "errors" in data) {
      return {
        ok: false,
        error: [
          {
            field: FieldErrorReason.UNAUTHORIZED,
            message: data.errors[0].message,
          },
        ],
      };
    }
    if (!res.ok && "errors" in data) {
      if (init.method?.toUpperCase() === "POST" || init.method?.toUpperCase() === "PUT") {
        const normalizedErrors: FieldError[] = data.errors.map((e) => ({
          field: e.field ?? "form",
          message: e.message,
        }));
        return {
          ok: false,
          error: normalizedErrors,
        };
      }
      return {
        ok: false,
        error: [
          {
            field: FieldErrorReason.BAD_REQUEST,
            message: data.errors[0].message,
          },
        ],
      };
    }
    const cookieHeader = res.headers.get("set-cookie");
    return {
      ok: true,
      data: data as T,
      cookieHeader: cookieHeader ?? "",
    };
  } catch (error) {
    console.error("Fetched Failed: ", error);
    return {
      ok: false,
      error: [
        {
          field: FieldErrorReason.SERVER,
          message: "Network error or server unavailable. Please try again later.",
        },
      ],
    };
  }
}

export enum FieldErrorReason {
  SERVER = "server",
  UNAUTHORIZED = "unauthorized",
  FORM = "form",
  BAD_REQUEST = "bad_request",
}

export type FieldError = { field: FieldErrorReason; message: string } | { field: string; message: string };
