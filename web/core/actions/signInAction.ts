"use server";

import { loginSchema } from "@/helpers/validation.form";
import { transformZodErrors } from "@/helpers/zod.helpers";
import { z } from "zod";

export async function signInAction(prevState: any, formData: FormData) {
  try {
    console.log("hello from server");
    const validateFields = loginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    console.log({ validateFields });

    // Add your authentication logic here
    // Handle successful login (set cookies, redirect, etc.)
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
