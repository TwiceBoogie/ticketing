"use server";

import { ticketFormSchema } from "@/helpers/validation.form";
import { transformZodErrors } from "@/helpers/zod.helpers";
import { z } from "zod";

export async function sellTicketAction(prevState: any, formData: FormData) {
  try {
    console.log(formData);
    const validateFields = ticketFormSchema.parse({
      title: formData.get("title"),
      price: formData.get("price"),
    });
    return { errors: null, data: "data received" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        errors: transformZodErrors(error),
        data: null,
      };
    }
    return { error: "bad", data: null };
  }
}
