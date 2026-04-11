"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMosqueWithAdminSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const GenderType = zod_1.default.enum(["MALE", "FEMALE", "OTHERS"]);
const passwordValidation = zod_1.default
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
exports.createMosqueWithAdminSchema = zod_1.default.object({
    mosque: zod_1.default.object({
        name: zod_1.default.string().min(1, "Mosque name is required").trim(),
        address: zod_1.default.string().min(1, "Mosque address is required").trim(),
        phone: zod_1.default
            .string()
            .min(11, "Phone number must be at least 11 digits")
            .max(15, "Phone number is too long")
            .regex(/^\d+$/, "Phone number must contain only digits")
            .trim(),
    }),
    admin: zod_1.default.object({
        name: zod_1.default.string().min(1, "Admin name is required").trim(),
        email: zod_1.default.string().email("Invalid email address").trim().toLowerCase(),
        password: passwordValidation,
        confirmPassword: zod_1.default.string(),
        address: zod_1.default.string().min(1, "Admin address is required").trim(),
        gender: GenderType,
        phone: zod_1.default
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
