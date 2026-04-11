"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMemberAccessoryPurchaseValidation = void 0;
const zod_1 = require("zod");
exports.createMemberAccessoryPurchaseValidation = zod_1.z.object({
    userId: zod_1.z.string().min(1, "User ID is required"),
    itemName: zod_1.z.string().min(1, "Item name is required"),
    quantity: zod_1.z.number().int().positive("Quantity must be a positive number"),
    price: zod_1.z.number().positive("Price must be a positive number"),
    totalPrice: zod_1.z.number().positive("Total price must be a positive number"),
    purchaseDate: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    paymentReceipt: zod_1.z.string().optional(),
    memberName: zod_1.z.string().optional(),
});
