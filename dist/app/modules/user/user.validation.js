"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.userValidation = exports.createUserSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
// Create / register schema (required fields)
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().nonempty("Name is required"),
    email: zod_1.z
        .string()
        .nonempty("Email is required")
        .email("Invalid email address"),
    password: zod_1.z
        .string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters"),
    address: zod_1.z
        .string()
        .min(3, "Address must be at least 3 characters")
        .optional(),
    gender: zod_1.z.enum(client_1.GenderType, { message: "Gender is required" }),
    role: zod_1.z.enum(client_1.RoleType, { message: "Role is required" }).optional(),
});
const updateUserSchema = exports.createUserSchema.partial();
exports.userValidation = {
    createUserSchema: exports.createUserSchema,
    updateUserSchema,
};
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .nonempty("Email is required")
        .email("Invalid email address"),
    password: zod_1.z.string().nonempty("Password is required"),
});
