// CsrfProvider.tsx
import { cookies } from "next/headers";
import { CSRF_COOKIE_NAME } from "@/constants/serverCookies";
import { CsrfError } from "@/helpers/errors/CsrfError";
import { CsrfProviderClient } from "@/lib/CsrfContext";

export async function CsrfProvider({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(CSRF_COOKIE_NAME)?.value;
  if (!token) {
    throw new CsrfError("Missing CSRF Token");
  }

  return <CsrfProviderClient token={token}>{children}</CsrfProviderClient>;
}
