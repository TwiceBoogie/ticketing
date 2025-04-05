import { z } from "zod";

export const transformZodErrors = (error: z.ZodError) => {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
};
