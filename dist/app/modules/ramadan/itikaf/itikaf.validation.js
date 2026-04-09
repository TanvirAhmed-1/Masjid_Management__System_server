"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itikafSchema = void 0;
const zod_1 = require("zod");
exports.itikafSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    fromDate: zod_1.z.coerce.date({
        message: "From date is required",
    }),
    toDate: zod_1.z.coerce.date({
        message: "To date is required",
    }),
    ramadanId: zod_1.z
        .string({ message: "Ramadan ID is required" })
});
