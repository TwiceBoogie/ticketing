import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookie = req.headers.get("Cookie");
    const data = await req.json();

    const res = await fetch(`${process.env.ORDERS_ENDPOINT!}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: String(cookie),
      },
      body: JSON.stringify({
        ticketId: data.id,
      }),
    });
    const responseData = await res.json();

    revalidatePath("/");
    revalidateTag("tickets");

    return Response.json({
      status: res.status,
      message: responseData,
      errors: [],
    });
  } catch (error) {
    console.log(error);
  }
}

export async function GET(req: Request) {
  revalidatePath("/");

  return Response.json({ message: "good" });
}
