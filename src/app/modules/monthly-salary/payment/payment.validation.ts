// src/modules/payment/payment.validation.ts
import { z } from "zod";

export const PaymentValidation = {
  create: z.object({
    memberId: z.string().length(24, "Invalid Member ID"),
    monthKey: z
      .string()
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month format must be YYYY-MM (ex: 2025-01)"),
    amount: z.number().positive("Amount must be greater than 0"),
  }),

  monthKey: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Invalid month format")
    .optional(),
};