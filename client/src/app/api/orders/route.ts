import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { createRedisInstance } from "@/core/config";
import { NextRequest } from "next/server";

const redis = createRedisInstance();

export async function POST(req: NextRequest) {
  try {
    const cookieArray = req.headers.get("Cookie")?.split("; ").filter(Boolean);
    const jwtCookie = cookieArray?.find((cookie) => cookie.startsWith("jwt="));

    const { id } = await req.json();

    const res = await fetch(`${process.env.ORDERS_ENDPOINT!}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: String(jwtCookie),
      },
      body: JSON.stringify({
        ticketId: id,
      }),
    });
    const responseData = await res.json();

    revalidatePath("/");

    await redis.set(`sessionId:${jwtCookie}`, responseData.id);

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
