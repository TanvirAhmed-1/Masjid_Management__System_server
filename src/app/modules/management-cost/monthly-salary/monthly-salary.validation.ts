import { z } from "zod";

export const createMonthlySalaryValidation = z.object({
  month: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  staffId: z.string().min(1, "Staff ID is required"),
  totalSalary: z.number().positive("Total salary must be a positive number"),
});
