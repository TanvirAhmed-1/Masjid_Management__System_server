import z from "zod";

const objectIdPattern = /^[a-f\d]{24}$/i;

export const ifterlistSchema = z.object({
  serialNumber: z.string().min(1, "Serial number is required"),
  name: z.string().min(1, "Name is required"),
  iftarDate: z.coerce.date({
    message: "Iftar date is required",
  }),
  dayName: z.string().min(1, "Day name is required"),
  ramadanyearId: z.string().regex(objectIdPattern, "Invalid Ramadan year ID"),
});
