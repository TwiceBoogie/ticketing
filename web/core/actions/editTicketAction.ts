"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SERVICES } from "@/constants/serverUrls";
import { updateTicketSchema } from "@/helpers/validation.form";
import { transformZodErrors } from "@/helpers/zod.helpers";
import { apiRequest, FieldError } from "@/lib/api/apiRequest";
import { ITicketResponse } from "@/types/ticket";
import { Result } from "@/types/common";

export async function editTicketAction(
  prevState: any,
  formData: FormData
): Promise<Result<ITicketResponse, FieldError[]>> {
  const ticketId = formData.get("ticketId");
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) {
    redirect(`/login?next_path=/tickets/${ticketId}`);
  }
  const validatedFields = updateTicketSchema.safeParse({
    ticketId: formData.get("ticketId"),
    title: formData.get("title"),
    price: formData.get("price"),
  });
  if (!validatedFields.success) {
    return {
      ok: false,
      error: transformZodErrors(validatedFields.error),
    };
  }

  const res = await apiRequest<ITicketResponse>(`${SERVICES.tickets}/api/tickets/${validatedFields.data.ticketId}`, {
    method: "PUT",
    headers: {
      cookie: `session=${cookie}`,
    },
    body: JSON.stringify(validatedFields),
  });

  if (res.ok) {
    revalidateTag("tickets");
  }
  return res;
}
