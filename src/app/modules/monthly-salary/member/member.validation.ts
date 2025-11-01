import { z } from "zod";

export const MemberValidation = {
  create: z.object({
    name: z.string({
      message: "Member name is required",
    }),

    phone: z
      .string({
        message: "Phone number is required",
      })
      .regex(/^[0-9]{10,14}$/, {
        message: "Phone number must be 10 to 14 digits",
      }),

    address: z.string().optional(),

    monthlyAmount: z
      .number({
        message: "Monthly amount must be a number",
      })
      .min(1, "Monthly amount must be greater than 0"),
  }),
};
