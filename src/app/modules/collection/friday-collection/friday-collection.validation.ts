import z from "zod";

export const fridayCollectionSchema = z.object({
  amount: z.number().min(0, "Collection amount must be at least 0"),
  collectionDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});
