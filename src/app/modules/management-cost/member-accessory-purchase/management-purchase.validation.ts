import { z } from "zod";

export const createMemberAccessoryPurchaseValidation = z.object({
  userId: z.string().min(1, "User ID is required"),
  itemName: z.string().min(1, "Item name is required"),
  quantity: z.number().int().positive("Quantity must be a positive number"),
  price: z.number().positive("Price must be a positive number"),
  totalPrice: z.number().positive("Total price must be a positive number"),
  purchaseDate: z.string().optional(), 
  description: z.string().optional(),
  paymentReceipt: z.string().optional(),
  memberName: z.string().optional(),
});
