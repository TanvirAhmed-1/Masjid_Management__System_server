import z from "zod";

export const fridayCollectionSchema = z.object({
  amount: z.number().min(0, "Collection amount must be at least 0"),
});
