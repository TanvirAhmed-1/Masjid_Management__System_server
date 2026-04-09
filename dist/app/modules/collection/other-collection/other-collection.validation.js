"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otherCollectionValidationSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.otherCollectionValidationSchema = zod_1.default.object({
    date: zod_1.default
        .string()
        .nonempty("Date is required")
        .transform((val) => new Date(val)),
    donors: zod_1.default
        .array(zod_1.default.object({
        name: zod_1.default.string().min(1, "Name is required"),
        amount: zod_1.default.number().min(0, "Amount must be non-negative"),
    }))
        .optional(),
    otherCollectionNameId: zod_1.default
        .string()
        .min(1, "Other Collection Name ID is required"),
});
