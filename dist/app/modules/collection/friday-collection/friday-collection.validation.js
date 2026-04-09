"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fridayCollectionSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.fridayCollectionSchema = zod_1.default.object({
    amount: zod_1.default.number().min(0, "Collection amount must be at least 0"),
    collectionDate: zod_1.default.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
});
