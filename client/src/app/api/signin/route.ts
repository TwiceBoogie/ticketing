import { createRedisInstance } from "@/core/config";
import { revalidatePath } from "next/cache";

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

    if (!res.ok || responseData.errors) {
      // If there's an error, keep the original response body structure
      return Response.json(
        {
          message: "Api Error",
          errors: responseData.errors,
        },
        {
          status: res.status,
        }
      );
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
    const jwtExpires = setCookieHeader.match(/expires=(.+)/);

    if (jwtMatch && jwtMatch[1] && jwtExpires) {
      const jwt = jwtMatch[1].split(";")[0];
      const expires = jwtExpires[1].split(";")[0];
      const userData = {
        userId: responseData.id,
        userEmail: responseData.email,
        jwtExpires: expires,
      };
      await redis.set(`user:${jwt}`, JSON.stringify(userData));
    } else {
      console.log("JWT not found in the cookie string");
    }

    revalidatePath("/");

    return Response.json(
      {
        message: responseData,
        errors: [],
      },
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
