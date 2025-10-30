import { z } from "zod";

const objectIdPattern = /^[a-f\d]{24}$/i;

export const donerSchema = z.object({
  serialNumber: z.string().min(1, "Serial number is required"),
  name: z.string().min(1, "Name is required"),
  iftarDate: z.coerce.date({ message: "Iftar date is required" }),
  dayName: z.string().min(1, "Day name is required"),
});

export const ifterListSchema = z.object({
  ramadanyearId: z.string().regex(objectIdPattern, "Invalid Ramadan year ID"),
  doners: z
    .array(donerSchema)
    .min(1, "At least one doner is required")
    .max(31, "Cannot add more than 31 doners for this Ramadan year"),
});
