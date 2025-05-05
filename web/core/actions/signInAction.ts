"use server";

import { cookies } from "next/headers";

import { SERVICES } from "@/constants/serverUrls";
import { parseSetCookie } from "@/helpers/parseSetCookie.helper";
import { loginSchema } from "@/helpers/validation.form";
import { transformZodErrors } from "@/helpers/zod.helpers";
import { apiRequest } from "@/lib/api/apiRequest";
import { IAuthResponse } from "@/types/auth";
import { FieldError, Result } from "@/types/common";

export async function signInAction(prevState: any, formData: FormData): Promise<Result<IAuthResponse, FieldError[]>> {
  const validateFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validateFields.success) {
    return {
      ok: false,
      error: transformZodErrors(validateFields.error),
    };
  }

  const res = await apiRequest<IAuthResponse>(`${SERVICES.auth}/api/users/signin`, {
    method: "POST",
    body: JSON.stringify(validateFields.data),
  });

  if (res.ok && res.cookieHeader) {
    const parsed = parseSetCookie(res.cookieHeader);
    (await cookies()).set({
      name: parsed.name,
      value: parsed.value,
      httpOnly: parsed.httpOnly,
      expires: parsed.expires,
      path: parsed.path,
      secure: parsed.secure,
    });
  }
  return res;
}
