"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSalaryPaymentValidation = void 0;
const zod_1 = require("zod");
exports.createSalaryPaymentValidation = zod_1.z.object({
    salaryId: zod_1.z.string({ message: "Salary ID is required" }),
    amount: zod_1.z.number({ message: "Amount is required" }),
    payDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
});
