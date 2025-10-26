
import { z } from "zod";

export const itikafSchema = z.object({
  name: z.string().min(1, "Name is required"),

  fromDate: z.coerce.date({
    message: "From date is required",
  }),

  toDate: z.coerce.date({
    message: "To date is required",
  }),

  ramadanId: z
    .string({ message: "Ramadan ID is required" })
});
