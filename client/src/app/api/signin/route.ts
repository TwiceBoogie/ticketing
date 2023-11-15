import { createRedisInstance } from "@/core/config";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const redis = createRedisInstance();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const res = await fetch(`${process.env.AUTH_ENDPOINT!}/api/users/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await res.json();

    if (!res.ok) {
      // If there's an error, keep the original response body structure
      return Response.json({
        status: res.status,
        message: "Api Error",
        errors: responseData.errors,
      });
    }

    // If the response is successful, create a new response with the same body structure
    const newHeaders: Record<string, string> = {
      "Content-Type": "application/json", // Include other headers as needed
    };
    const setCookieHeader = res.headers.get("Set-Cookie") as string;
    if (setCookieHeader) {
      newHeaders["Set-Cookie"] = setCookieHeader;
    }

    const jwtMatch = setCookieHeader.match(/jwt=(.+)/);

    if (jwtMatch && jwtMatch[1]) {
      const jwt = jwtMatch[1].split(";")[0];
      redis.set(jwt, responseData.id);
    } else {
      console.log("JWT not found in the cookie string");
    }

    revalidatePath("/");

    return new Response(
      JSON.stringify({
        status: res.status,
        message: responseData,
        errors: [],
      }),
      {
        headers: newHeaders,
        status: res.status,
      }
    );
  } catch (error) {
    console.log(error);
  }
}

export async function GET(req: Request) {
  const cookie = req.headers.get("Cookie");
  const res = await fetch(
    `${process.env.AUTH_ENDPOINT!}/api/users/currentuser`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: String(cookie),
      },
      next: {
        tags: ["user"],
      },
    }
  );
  const responseData = await res.json();

  return Response.json({
    currentUser: responseData.currentUser,
  });
}
