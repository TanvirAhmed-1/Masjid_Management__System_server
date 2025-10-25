import { z } from "zod";

export const ramadandatasetupSchema = z.object({
  titleName: z.string().min(1, "Name is required"),
  ramadanYear: z
    .string()
    .regex(/^\d{4}$/, "Enter a valid 4-digit year")
    .refine(
      (val) => Number(val) >= 2000 && Number(val) <= 3000,
      "Enter a valid year between 1400 and 1600"
    ),
});