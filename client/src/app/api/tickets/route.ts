import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const jwt = cookies().get("jwt");
    const data = await req.json();
    const res = await fetch(`${process.env.TICKETS_ENDPOINT!}/api/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `jwt=${jwt?.value}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await res.json();
    if (!res.ok) {
      return Response.json({
        status: res.status,
        message: res.status === 401 ? "Not authorized" : "Server error",
        errors: responseData.errors,
      });
    }
    revalidateTag("tickets");
    return Response.json({
      status: res.status,
      message: "Successfully created a ticket",
      errors: [],
    });
  } catch (error) {
    console.log(error);
  }
}

export async function PUT(req: Request) {
  try {
    const cookie = req.headers.get("Cookie");
    const body = await req.json();
    const itemId = body.id;

    const res = await fetch(
      `${process.env.TICKETS_ENDPOINT!}/api/tickets/${body.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: String(cookie),
        },
        body: JSON.stringify({
          title: body.title,
          price: body.price,
        }),
      }
    );
    const responseData = await res.json();
    console.log(responseData);
    revalidateTag("tickets");
    return Response.json({ message: "api endpoint hit" });
  } catch (error) {
    console.log(error);
  }
}

export async function GET(req: Request) {
  revalidateTag("tickets");
  return Response.json({
    status: 200,
  });
}
