export const dynamic = "force-dynamic";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("Cookie");
    const res = await fetch(`${process.env.AUTH_ENDPOINT}/api/users/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: String(cookie),
      },
    });

    const responseData = await res.json();
    cookies().delete("jwt");
    return Response.json({ message: "good" });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "bad" });
  }
}
