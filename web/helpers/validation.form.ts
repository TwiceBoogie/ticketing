import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const ticketFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be positive")
    .max(10000, "Price must be less than $10,000")
    .refine((value) => {
      // Ensure price has at most 2 decimal places
      const decimalPart = value.toString().split(".")[1];
      return !decimalPart || decimalPart.length <= 2;
    }, "Price must have at most 2 decimal places"),
});

// You can use this type in your action
export type TicketFormValues = z.infer<typeof ticketFormSchema>;
