"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberValidation = void 0;
const zod_1 = require("zod");
exports.MemberValidation = {
    create: zod_1.z.object({
        name: zod_1.z
            .string({
            message: "Member name is required",
        })
            .min(1, "Name cannot be empty"),
        phone: zod_1.z
            .string()
            .regex(/^[0-9]{10,14}$/, "Invalid phone number (10-14 digits)")
            .optional()
            .or(zod_1.z.literal("").transform(() => undefined)), // empty string → null
        address: zod_1.z.string().optional(),
        monthlyAmount: zod_1.z
            .number({ message: "Monthly amount is required" })
            .positive("Amount must be greater than 0"),
    }),
    update: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        phone: zod_1.z
            .string()
            .regex(/^[0-9]{10,14}$/)
            .optional()
            .nullable(),
        address: zod_1.z.string().optional().nullable(),
        monthlyAmount: zod_1.z.number().positive().optional(),
    }),
};
