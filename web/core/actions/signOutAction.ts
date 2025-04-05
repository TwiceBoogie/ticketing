"use server";

import { clearJwtCookie } from "@/helpers/parseSetCookie.helper";

export async function signOutAction() {
  try {
    await clearJwtCookie();
    return { ok: true, message: "Sign Out Successful" };
  } catch (error) {
    console.error("Server error");
    return { ok: false, message: "Sign Out Failed" };
  }
}
