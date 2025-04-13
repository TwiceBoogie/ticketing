"use server";

import { SERVICES } from "@/constants/serverUrls";
import { orderTicketSchema } from "@/helpers/validation.form";
import { transformZodErrors } from "@/helpers/zod.helpers";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function purchaseTicketAction(prevState: any, formData: FormData) {
  const ticketId = formData.get("ticketId");
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) {
    redirect(`/login?next_path=/tickets/${ticketId}`);
  }
  try {
    const validatedFields = orderTicketSchema.parse({ ticketId });
    const res = await fetch(`${SERVICES.orders}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: `session=${cookie}`,
      },
      body: JSON.stringify(validatedFields),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error("Something went wrong here");
    }
    revalidateTag("tickets");
    return {
      ok: true,
      data,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        ok: false,
        error: transformZodErrors(error),
      };
    }
    return {
      ok: false,
      error: [{ field: "form", message: "Something went wrong. Please try again." }],
    };
  }
}
