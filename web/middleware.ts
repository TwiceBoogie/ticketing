import { CSRF_COOKIE_NAME } from "@/constants/serverCookies";
import { NextRequest, NextResponse } from "next/server";

function generateCsrfToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString("hex"); // or use btoa([...array].join(''))
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const token = generateCsrfToken();
  response.cookies.set({
    name: CSRF_COOKIE_NAME,
    value: token,
    path: "/",
    maxAge: 60 * 10, // 10 minutes
    secure: true,
    sameSite: "strict",
  });
  return response;
}

export const config = {
  matcher: ["/login", "/register", "/tickets"],
};
