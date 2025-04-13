"use server";

import { SERVICES } from "@/constants/serverUrls";
import { validateCsrfToken } from "@/helpers/csrfToken.helper";
import { CsrfError } from "@/helpers/errors/CsrfError";
import { ticketFormSchema } from "@/helpers/validation.form";
import { transformZodErrors } from "@/helpers/zod.helpers";
import { FieldError, Result } from "@/types/auth";
import { ITicketErrorResponse, ITicketResponse } from "@/types/ticket";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

export async function sellTicketAction(
  prevState: any,
  formData: FormData
): Promise<Result<ITicketResponse, FieldError[]>> {
  try {
    await validateCsrfToken(formData.get("csrfToken"));
    const validateFields = ticketFormSchema.parse({
      title: formData.get("title"),
      price: formData.get("price"),
    });

    const session = (await cookies()).get("session")?.value;
    const res = await fetch(`${SERVICES.tickets}/api/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${session}`,
      },
      body: JSON.stringify(validateFields),
    });

    const data: ITicketResponse | ITicketErrorResponse = await res.json();
    console.log(data);

    if (!res.ok && "errors" in data) {
      const normalizedErrors: FieldError[] = data.errors.map((e) => ({
        field: e.field ?? "form",
        message: e.message,
      }));
      return {
        ok: false,
        error: normalizedErrors,
      };
    }

    // everything okay
    revalidateTag("tickets");
    return { ok: true, data: data as ITicketResponse };
  } catch (error) {
    if (error instanceof CsrfError) {
      return {
        ok: false,
        error: [{ field: "form", message: error.message }],
      };
    }
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
