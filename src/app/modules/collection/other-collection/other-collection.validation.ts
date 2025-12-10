import z from "zod";

export const otherCollectionValidationSchema = z.object({
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
  userId: z.string().min(1, "User ID is required"),
});
