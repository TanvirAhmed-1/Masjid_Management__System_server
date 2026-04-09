"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ifterListSchema = exports.donerSchema = void 0;
const zod_1 = require("zod");
const objectIdPattern = /^[a-f\d]{24}$/i;
exports.donerSchema = zod_1.z.object({
    serialNumber: zod_1.z.string().min(1, "Serial number is required"),
    name: zod_1.z.string().min(1, "Name is required"),
    iftarDate: zod_1.z.coerce.date({ message: "Iftar date is required" }),
    dayName: zod_1.z.string().min(1, "Day name is required"),
});
exports.ifterListSchema = zod_1.z.object({
    ramadanyearId: zod_1.z.string().regex(objectIdPattern, "Invalid Ramadan year ID"),
    doners: zod_1.z
        .array(exports.donerSchema)
        .min(1, "At least one doner is required")
        .max(31, "Cannot add more than 31 doners for this Ramadan year"),
});
