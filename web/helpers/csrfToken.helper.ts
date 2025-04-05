import { cookies } from "next/headers";
import { CSRF_COOKIE_NAME } from "@/constants/serverCookies";
import { CsrfError } from "./errors/CsrfError";

export async function validateCsrfToken(tokenFromForm: FormDataEntryValue | null) {
  const csrfCookie = (await cookies()).get(CSRF_COOKIE_NAME);
  if (!csrfCookie || !tokenFromForm || csrfCookie.value != tokenFromForm) {
    throw new CsrfError();
  }
}
