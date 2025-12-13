import z from "zod";

export const otherCollectionValidationSchema = z.object({
  date: z
    .string()
    .nonempty("Date is required")
    .transform((val) => new Date(val)),
  donors: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        amount: z.number().min(0, "Amount must be non-negative"),
      })
    )
    .min(1, "At least one donor is required"),
  otherCollectionNameId: z
    .string()
    .min(1, "Other Collection Name ID is required"),
});
