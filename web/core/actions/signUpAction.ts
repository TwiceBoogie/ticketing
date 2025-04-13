"use server";

import { SERVICES } from "@/constants/serverUrls";
import { validateCsrfToken } from "@/helpers/csrfToken.helper";
import { CsrfError } from "@/helpers/errors/CsrfError";
import { parseSetCookie } from "@/helpers/parseSetCookie.helper";
import { loginSchema } from "@/helpers/validation.form";
import { transformZodErrors } from "@/helpers/zod.helpers";
import { FieldError, IAuthErrorResponse, IAuthResponse, Result } from "@/types/auth";
import { cookies } from "next/headers";
import { z } from "zod";

export async function signUpAction(prevState: any, formData: FormData): Promise<Result<IAuthResponse, FieldError[]>> {
  try {
    await validateCsrfToken(formData.get("csrfToken"));
    const validateFields = loginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const res = await fetch(`${SERVICES.auth}/api/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validateFields),
    });

    const data: IAuthResponse | IAuthErrorResponse = await res.json();

    if (!res.ok && "errors" in data) {
      const normalizedErrors: FieldError[] = data.errors.map((e) => ({
        field: e.field ?? "form",
        message: e.message,
      }));
      return {
        ok: false,
        error: normalizedErrors,
      };
    }

    const setCookieHeader = res.headers.get("set-cookie");
    if (setCookieHeader) {
      const parsed = parseSetCookie(setCookieHeader);
      (await cookies()).set({
        name: parsed.name,
        value: parsed.value,
        httpOnly: parsed.httpOnly,
        expires: parsed.expires,
        path: parsed.path,
        secure: parsed.secure,
      });
    }
    return { ok: true, data: data as IAuthResponse };
  } catch (error) {
    if (error instanceof CsrfError) {
      return {
        ok: false,
        error: [{ field: "form", message: error.message }],
      };
    }
    if (error instanceof z.ZodError) {
      return {
        ok: false,
        error: transformZodErrors(error),
      };
    }
    return {
      ok: false,
      error: [{ field: "form", message: "Something went wrong. Please try again." }],
    };
  }
}
