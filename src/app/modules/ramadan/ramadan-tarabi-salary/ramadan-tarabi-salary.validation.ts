import { z } from "zod";

export const RamadanTarabiPaymentValidation = {
  create: z.object({
    amount: z.number().positive("Amount must be greater than 0"),
    ramadanYearId: z.string({ message: "Ramadan Year ID is required" }),
    memberId: z.string({ message: "Member ID is required" }),
    payDate: z.coerce.date().optional(),
  }),
  update: z.object({
    amount: z.number().positive().optional(),
  }),
};
