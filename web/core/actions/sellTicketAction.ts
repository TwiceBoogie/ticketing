"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
// HELPERS
import { ticketFormSchema } from "@/helpers/validation.form";
import { transformZodErrors } from "@/helpers/zod.helpers";
// TYPES
import { FieldError, Result } from "@/types/common";
import { ITicketResponse } from "@/types/ticket";
// CONSTANTS
import { SERVICES } from "@/constants/serverUrls";
import { apiRequest } from "@/lib/api/apiRequest";

export async function sellTicketAction(
  prevState: any,
  formData: FormData
): Promise<Result<ITicketResponse, FieldError[]>> {
  const validateFields = ticketFormSchema.safeParse({
    title: formData.get("title"),
    price: formData.get("price"),
  });

  if (!validateFields.success) {
    return {
      ok: false,
      error: transformZodErrors(validateFields.error),
    };
  }

  const session = (await cookies()).get("session")?.value;
  const res = await apiRequest<ITicketResponse>(`${SERVICES.tickets}/api/tickets`, {
    method: "POST",
    headers: {
      Cookie: `session=${session}`,
    },
    body: JSON.stringify(validateFields.data),
  });

  if (res.ok) {
    revalidateTag("tickets");
  }
  return res;
}
