"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const createstffDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { mosqueId } = payload;
    if (!mosqueId)
        throw new Error("Mosque ID is required");
    return yield prisma_1.default.staff.create({
        data: payload,
    });
});
const getAllstaffDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { mosqueId, limit = 20, page = 1, sortBy = "createdAt", sortOrder = "desc", name, phone, } = query;
    if (!mosqueId)
        throw new Error("Mosque ID is required");
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const whereCondition = { mosqueId };
    if (name) {
        whereCondition.name = {
            contains: name,
            mode: "insensitive",
        };
    }
    if (phone) {
        whereCondition.phone = {
            contains: phone,
            mode: "insensitive",
        };
    }
    const result = yield prisma_1.default.staff.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_1.default.staff.count({ where: whereCondition });
    const totalPage = Math.ceil(total / Number(limit));
    return {
        data: result,
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPage,
        },
    };
});
const getstaffByIdDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Id is required");
    return yield prisma_1.default.staff.findUnique({
        where: { id },
    });
});
const updatestaffDB = (id, payload, mosqueId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mosqueId)
        throw new Error("Mosque ID is required");
    if (!id)
        throw new Error("Id is required");
    return yield prisma_1.default.staff.update({
        where: { id, mosqueId },
        data: payload,
    });
});
const updateStatus = (id, status, mosqueId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mosqueId)
        throw new Error("Mosque ID is required");
    if (!id)
        throw new Error("Id is required");
    return yield prisma_1.default.staff.update({
        where: { id, mosqueId },
        data: { active: status },
    });
});
const deletestaffDB = (id, mosqueId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Id is required");
    if (!mosqueId)
        throw new Error("Mosque ID is required");
    const staff = yield prisma_1.default.staff.findUnique({ where: { id, mosqueId } });
    if (!staff)
        throw new Error("Staff not found");
    return yield prisma_1.default.staff.delete({ where: { id } });
});
exports.staffServices = {
    createstffDB,
    getAllstaffDB,
    getstaffByIdDB,
    updatestaffDB,
    updatestaffStatusDB: updateStatus,
    deletestaffDB,
};
