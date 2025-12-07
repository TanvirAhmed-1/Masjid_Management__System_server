// ramadan-iftar-salary.validation.ts
import z from "zod";

export const RamadanIftarSalarySchema = z.object({
  ramadanYear: z.string().min(1, "Ramadan year is required"),
  totalSalary: z.number().positive("Total salary must be greater than 0"),
  userId: z.string().min(1, "User ID is required"),
});

export const RamadanIftarSalaryPaymentSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  salaryId: z.string().min(1, "Salary ID is required"),
  memberId: z.string().min(1, "Member ID is required"),
  userId: z.string().min(1, "User ID is required"),
  payDate: z.coerce.date().optional(),
});
