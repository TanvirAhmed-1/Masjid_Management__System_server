import z from "zod";

export const createStaffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  role: z.string().min(1, "Role is required"),
  baseSalary: z.number().positive("Base salary must be greater than 0"),
  joinDate: z.string().optional(),
  active: z.boolean().optional(),
  image: z.string().optional(),
  address: z.string().min(1, "Address is required"),
});
