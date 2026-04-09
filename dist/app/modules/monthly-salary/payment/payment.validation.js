"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidation = void 0;
// src/modules/payment/payment.validation.ts
const zod_1 = require("zod");
exports.PaymentValidation = {
    create: zod_1.z.object({
        memberId: zod_1.z.string().length(24, "Invalid Member ID"),
        monthKey: zod_1.z
            .string()
            .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month format must be YYYY-MM (ex: 2025-01)"),
        amount: zod_1.z.number().positive("Amount must be greater than 0"),
    }),
    monthKey: zod_1.z
        .string()
        .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Invalid month format")
        .optional(),
};
