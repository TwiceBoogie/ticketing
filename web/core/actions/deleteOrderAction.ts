"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SERVICES } from "@/constants/serverUrls";
import { flattenOrders } from "@/helpers/formatDate.helper";
import { orderTicketSchema } from "@/helpers/validation.form";
import { transformZodErrors } from "@/helpers/zod.helpers";
import { apiRequest, FieldError } from "@/lib/api/apiRequest";
import { Result } from "@/types/common";
import { FlattenedOrder, Order } from "@/types/order";

export async function deleteOrderAction(
  prevState: any,
  formData: FormData
): Promise<Result<FlattenedOrder, FieldError[]>> {
  const ticketId = formData.get("orderId");
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

  const res = await apiRequest<Order>(`${SERVICES.orders}/api/orders/${validatedFields.data.ticketId}`, {
    method: "DELETE",
    headers: {
      cookie: `session=${cookie}`,
    },
  });

  if (!res.ok) return res;

  const flattened = flattenOrders([res.data])[0];
  return {
    ok: true,
    data: flattened,
    cookieHeader: "",
  };
}
