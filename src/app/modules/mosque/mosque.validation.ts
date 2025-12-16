// validations/createMosqueWithAdmin.validation.ts

import z from "zod";

// Prisma-এর সাথে মিল রেখে OTHERS যোগ করলাম
const GenderType = z.enum(["MALE", "FEMALE", "OTHERS"]);

// পাসওয়ার্ড ভ্যালিডেশন
const passwordValidation = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"); 

export const createMosqueWithAdminSchema = z.object({
  mosque: z.object({
    name: z.string().min(1, "Mosque name is required").trim(),
    address: z.string().min(1, "Mosque address is required").trim(),
    phone: z
      .string()
      .min(11, "Phone number must be at least 11 digits")
      .max(15, "Phone number is too long")
      .regex(/^\d+$/, "Phone number must contain only digits")
      .trim(),
  }),

  admin: z.object({
    name: z.string().min(1, "Admin name is required").trim(),
    email: z.string().email("Invalid email address").trim().toLowerCase(),
    password: passwordValidation,
    confirmPassword: z.string(),
    address: z.string().min(1, "Admin address is required").trim(),
    gender: GenderType,
    // role ফিল্ড সরিয়ে ফেললাম – ব্যাকএন্ডে "ADMIN" সেট হবে
    phone: z
      .string()
      .regex(/^\d*$/, "Phone number must contain only digits")
      .optional()
      .transform((val) => (val === "" ? null : val)), // empty string → null
  }),
})
  .refine((data) => data.admin.password === data.admin.confirmPassword, {
    message: "Passwords do not match",
    path: ["admin", "confirmPassword"],
  });
