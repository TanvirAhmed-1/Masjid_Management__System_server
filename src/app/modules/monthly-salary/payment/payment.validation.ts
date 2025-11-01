import { z } from "zod";

export const PaymentValidationSchema = z.object({
  memberId: z.string({ message: "Member ID is required" }),
  monthKey: z.string({ message: "Month key is required" }),
  monthName: z.string({ message: "Month name is required" }),
  amount: z
    .number({ message: "Amount must be a number" })
    .min(1, "Amount must be greater than 0"),
});
