"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RamadanTarabiPaymentValidation = void 0;
const zod_1 = require("zod");
exports.RamadanTarabiPaymentValidation = {
    create: zod_1.z.object({
        amount: zod_1.z.number().positive("Amount must be greater than 0"),
        paidAmount: zod_1.z.number().nonnegative("Paid amount cannot be negative").default(0),
        ramadanYearId: zod_1.z.string({ message: "Ramadan Year ID is required" }),
        memberId: zod_1.z.string({ message: "Member ID is required" }),
        payDate: zod_1.z.coerce.date().optional(),
    }),
    update: zod_1.z.object({
        amount: zod_1.z.number().positive().optional(),
    }),
};
