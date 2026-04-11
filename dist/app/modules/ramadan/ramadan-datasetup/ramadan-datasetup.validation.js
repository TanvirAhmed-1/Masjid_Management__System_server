"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ramadandatasetupSchema = void 0;
const zod_1 = require("zod");
exports.ramadandatasetupSchema = zod_1.z.object({
    titleName: zod_1.z.string().min(1, "Name is required"),
    ramadanYear: zod_1.z
        .string()
        .regex(/^\d{4}$/, "Enter a valid 4-digit year")
        .refine((val) => Number(val) >= 2000 && Number(val) <= 3000, "Enter a valid year between 1400 and 1600"),
});
