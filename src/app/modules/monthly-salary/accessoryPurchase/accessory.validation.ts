import { z } from "zod";

export const AccessoryPurchaseValidation = {
  create: z.object({
    itemName: z.string({ message: "Item name is required" }),
    quantity: z.number().int().min(1, "Quantity must be at least 1").default(1),
    price: z.number().positive("Price must be a positive number"),
    totalPrice: z.number().positive("Total price must be a positive number"),
    purchaseDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
    description: z.string().optional(),
    paymentReceipt: z.string().optional(),
    memberName: z.string().optional(),
  }),

  update: z.object({
    itemName: z.string().optional(),
    quantity: z.number().int().min(1).optional(),
    price: z.number().positive().optional(),
    totalPrice: z.number().positive().optional(),
    description: z.string().optional(),
    memberName: z.string().optional(),
  }),
};