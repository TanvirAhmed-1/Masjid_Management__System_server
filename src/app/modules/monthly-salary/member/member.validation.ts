
import { z } from "zod";

export const MemberValidation = {
  create: z.object({
    name: z
      .string({
        message: "Member name is required",
      })
      .min(1, "Name cannot be empty"),

    phone: z
      .string()
      .regex(/^[0-9]{10,14}$/, "Invalid phone number (10-14 digits)")
      .optional()
      .or(z.literal("").transform(() => undefined)), // empty string → null

    address: z.string().optional(),

    monthlyAmount: z
      .number({ message: "Monthly amount is required" })
      .positive("Amount must be greater than 0"),
  }),

  update: z.object({
    name: z.string().min(1).optional(),
    phone: z
      .string()
      .regex(/^[0-9]{10,14}$/)
      .optional()
      .nullable(),
    address: z.string().optional().nullable(),
    monthlyAmount: z.number().positive().optional(),
  }),
};
