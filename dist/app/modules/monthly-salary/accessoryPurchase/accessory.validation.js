"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessoryPurchaseValidation = void 0;
const zod_1 = require("zod");
exports.AccessoryPurchaseValidation = {
    create: zod_1.z.object({
        itemName: zod_1.z.string({ message: "Item name is required" }),
        quantity: zod_1.z.number().int().min(1, "Quantity must be at least 1").default(1),
        price: zod_1.z.number().positive("Price must be a positive number"),
        totalPrice: zod_1.z.number().positive("Total price must be a positive number"),
        purchaseDate: zod_1.z.string().optional().transform((val) => val ? new Date(val) : undefined),
        description: zod_1.z.string().optional(),
        paymentReceipt: zod_1.z.string().optional(),
        memberName: zod_1.z.string().optional(),
    }),
    update: zod_1.z.object({
        itemName: zod_1.z.string().optional(),
        quantity: zod_1.z.number().int().min(1).optional(),
        price: zod_1.z.number().positive().optional(),
        totalPrice: zod_1.z.number().positive().optional(),
        description: zod_1.z.string().optional(),
        memberName: zod_1.z.string().optional(),
    }),
};
