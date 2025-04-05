import { cookies } from "next/headers";

export async function clearJwtCookie() {
  (await cookies()).set({
    name: "jwt",
    value: "",
    path: "/",
    expires: new Date(0), // Unix epoch
    httpOnly: true,
    secure: true,
  });
}

export function parseSetCookie(setCookie: string) {
  const parts = setCookie.split(";").map((p) => p.trim());
  const [nameValue, ...rest] = parts;
  const [name, value] = nameValue.split("=");

  const getAttr = (key: string) => rest.find((p) => p.toLowerCase().startsWith(`${key.toLowerCase()}=`))?.split("=")[1];

  const expires = getAttr("expires") ? new Date(getAttr("expires")!) : undefined;
  const path = getAttr("path") || "/";
  const httpOnly = rest.some((p) => p.toLowerCase() === "httponly");
  const secure = rest.some((p) => p.toLowerCase() === "secure");

  return { name, value, expires, path, httpOnly, secure };
}
