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
      return Response.json(
        {
          message: res.status === 401 ? "Not authorized" : "Server error",
          errors: responseData.errors,
        },
        { status: res.status }
      );
    }
    revalidateTag("tickets");
    return Response.json(
      {
        message: "Successfully created a ticket",
        errors: [],
      },
      { status: res.status }
    );
  } catch (error) {
    console.log(error);
  }
}

export async function PUT(req: Request) {
  try {
    const cookie = req.headers.get("Cookie");
    const body = await req.json();

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
