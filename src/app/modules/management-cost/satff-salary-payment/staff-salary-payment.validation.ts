import { z } from "zod";

export const createSalaryPaymentValidation = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  payDate: z.string().optional(),
  salaryId: z.string().min(1, "Salary ID is required"),
  userId: z.string().min(1, "User ID is required"),
});
