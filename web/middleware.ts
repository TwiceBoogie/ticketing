import { CSRF_COOKIE_NAME } from "@/constants/serverCookies";
import { NextRequest, NextResponse } from "next/server";

function getJwtFromSessionCookie(encodedSession: string): string | null {
  try {
    const json = JSON.parse(Buffer.from(encodedSession, "base64url").toString("utf-8"));
    return json.jwt || null;
  } catch (error) {
    return null;
  }
}

function isProbablyJwt(encodedSession: string | undefined | null): boolean {
  if (!encodedSession) return false;

  const jwt = getJwtFromSessionCookie(encodedSession);
  if (!jwt) return false;

  const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
  return jwtPattern.test(jwt);
}

function generateCsrfToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString("hex");
}

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const isJwt = isProbablyJwt(session);
  const pathname = request.nextUrl.pathname;
  // make sure it exist and the value is jwt standard format.
  // Actual validation happens on the express backend server
  if (!isJwt && pathname === "/orders") {
    return NextResponse.redirect(new URL(`/login?next_path=${pathname}`, request.url), 302);
  }
  if (isJwt && ["/login", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url), 302);
  }
  const response = NextResponse.next();

  // so it doesn't run when submitting form (server action)
  if (request.method === "GET") {
    const token = generateCsrfToken();
    response.cookies.set({
      name: CSRF_COOKIE_NAME,
      value: token,
      path: "/",
      maxAge: 60 * 10, // 10 minutes
      secure: true,
      sameSite: "strict",
      httpOnly: true,
    });
  }

  return response;
}

export const config = {
  matcher: ["/login", "/register", "/tickets", "/orders"],
};
