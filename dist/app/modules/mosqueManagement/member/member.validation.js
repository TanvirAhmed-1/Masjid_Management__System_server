"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMemberValidationSchema = void 0;
const zod_1 = require("zod");
exports.createMemberValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required").trim(),
    email: zod_1.z.string().email("Invalid email address").trim().toLowerCase(),
    phone: zod_1.z
        .string()
        .min(11, "Phone number must be at least 11 digits")
        .max(15, "Phone number is too long")
        .regex(/^\d+$/, "Phone number must contain only digits")
        .trim(),
    address: zod_1.z.string().min(1, "Address is required").trim(),
    gender: zod_1.z.enum(["MALE", "FEMALE", "OTHERS"]),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters")
});
