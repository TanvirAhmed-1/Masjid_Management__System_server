"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStaffSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createStaffSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Name is required"),
    phone: zod_1.default.string().min(1, "Phone number is required"),
    role: zod_1.default.string().min(1, "Role is required"),
    baseSalary: zod_1.default.number().positive("Base salary must be greater than 0"),
    joinDate: zod_1.default.string().optional(),
    active: zod_1.default.boolean().optional(),
    image: zod_1.default.string().optional(),
    address: zod_1.default.string().min(1, "Address is required"),
});
