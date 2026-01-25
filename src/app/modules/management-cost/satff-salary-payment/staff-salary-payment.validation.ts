import { z } from "zod";

export const createSalaryPaymentValidation = z.object({
  salaryId: z.string({ message: "Salary ID is required" }),
  amount: z.number({ message: "Amount is required" }),
  payDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});
