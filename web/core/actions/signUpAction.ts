"use server";

import { loginSchema } from "@/helpers/validation.form";
import { transformZodErrors } from "@/helpers/zod.helpers";
import { z } from "zod";

export async function signUpAction(prevState: any, formData: FormData) {
  try {
    const validateFields = loginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Add your authentication logic here
    const res = await fetch("http://auth-srv:3000/api/users/signup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validateFields),
    });
    if (!res.ok) {
      throw new Error("server problems");
    }
    console.log(res);
    const dt = await res.json();
    console.log(dt);
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
