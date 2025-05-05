"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SERVICES } from "@/constants/serverUrls";
import { orderTicketSchema } from "@/helpers/validation.form";
import { transformZodErrors } from "@/helpers/zod.helpers";
import { apiRequest } from "@/lib/api/apiRequest";
import { FieldError, Result } from "@/types/common";
import { Order } from "@/types/order";

export async function purchaseTicketAction(prevState: any, formData: FormData): Promise<Result<Order, FieldError[]>> {
  const ticketId = formData.get("ticketId");
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) {
    redirect(`/login?next_path=/tickets/${ticketId}`);
  }
  const validatedFields = orderTicketSchema.safeParse({ ticketId });
  if (!validatedFields.success) {
    return {
      ok: false,
      error: transformZodErrors(validatedFields.error),
    };
  }

  const res = await apiRequest<Order>(`${SERVICES.orders}/api/orders`, {
    method: "POST",
    headers: {
      cookie: `session=${cookie}`,
    },
    body: JSON.stringify(validatedFields.data),
  });

  if (res.ok) {
    revalidateTag("tickets");
  }
  return res;
}
