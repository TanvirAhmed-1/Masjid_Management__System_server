"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMonthlySalaryValidation = void 0;
const zod_1 = require("zod");
exports.createMonthlySalaryValidation = zod_1.z.object({
    month: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    staffId: zod_1.z.string().min(1, "Staff ID is required"),
    totalSalary: zod_1.z.number().positive("Total salary must be a positive number"),
});
