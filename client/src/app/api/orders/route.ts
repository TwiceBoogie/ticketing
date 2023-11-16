import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { createRedisInstance } from "@/core/config";

const redis = createRedisInstance();

export async function POST(req: Request) {
  try {
    const cookieArray = req.headers.get("Cookie")?.split("; ").filter(Boolean);
    const jwtCookie = cookieArray?.find((cookie) => cookie.startsWith("jwt="));

    const data = await req.json();

    const res = await fetch(`${process.env.ORDERS_ENDPOINT!}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: String(jwtCookie),
      },
      body: JSON.stringify({
        ticketId: data.id,
      }),
    });
    const responseData = await res.json();

    revalidatePath("/");

    console.log(responseData);
    redis.set(`user:${jwtCookie}`, responseData.id);

    return Response.json({
      message: "great",
    });
  } catch (error) {
    console.log(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieArray = req.headers.get("Cookie")?.split("; ").filter(Boolean);
    const jwtCookie = cookieArray?.find((cookie) => cookie.startsWith("jwt="));

    const { id } = await req.json();

    const res = await fetch(
      `${process.env.ORDERS_ENDPOINT!}/api/orders/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: String(jwtCookie),
        },
      }
    );

    if (res.ok) {
      return Response.json({
        message: "Deleted",
        errors: [],
      });
    }

    const responseData = await res.json();

    return Response.json(
      {
        message: "Api Error",
        errors: responseData.errors,
      },
      {
        status: res.status,
      }
    );
  } catch (error) {
    console.log(error);
  }
}

export async function GET(req: Request) {
  revalidatePath("/");

  return Response.json({ message: "good" });
}
