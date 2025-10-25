import { z } from "zod";

export const itikafSchema = z.object({
  name: z.string().min(1, "Name is required"),
  fromDate: z
    .date({
      message: "From date is required",
    })
    .optional(),
  toDate: z
    .date({
      message: "To date is required",
    })
    .optional(),
  ramadanYear: z
    .string()
    .regex(/^\d{4}$/, "Enter a valid 4-digit year")
    .refine(
      (val) => Number(val) >= 2000 && Number(val) <= 3000,
      "Enter a valid year between 1400 and 1600"
    ),
});
