import { z } from "zod";

export const createMemberValidationSchema = z.object({
    name: z.string().min(1, "Name is required").trim(),     
    email: z.string().email("Invalid email address").trim().toLowerCase(),
    phone: z
      .string()
      .min(11, "Phone number must be at least 11 digits")
      .max(15, "Phone number is too long")
      .regex(/^\d+$/, "Phone number must contain only digits")
      .trim(),
    address: z.string().min(1, "Address is required").trim(),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
});

