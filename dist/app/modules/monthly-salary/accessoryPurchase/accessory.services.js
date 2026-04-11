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
exports.accessoryPurchaseServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const createPurchaseDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.mosqueId) {
        throw new Error("Mosque ID is required");
    }
    return yield prisma_1.default.memberAccessoryPurchase.create({ data: payload });
});
const getAllPurchasesDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { mosqueId, limit = 20, page = 1, sortBy = "purchaseDate", sortOrder = "desc", itemName, memberName, from, to, } = query;
    if (!mosqueId) {
        throw new Error("Mosque ID is required");
    }
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const whereCondition = { mosqueId };
    if (itemName) {
        whereCondition.itemName = { contains: itemName, mode: "insensitive" };
    }
    if (memberName) {
        whereCondition.memberName = { contains: memberName, mode: "insensitive" };
    }
    if (from || to) {
        whereCondition.createdAt = {};
        if (from) {
            whereCondition.createdAt.gte = new Date(from);
        }
        if (to) {
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999);
            whereCondition.createdAt.lte = toDate;
        }
    }
    const result = yield prisma_1.default.memberAccessoryPurchase.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: { user: true },
    });
    const total = yield prisma_1.default.memberAccessoryPurchase.count({
        where: whereCondition,
    });
    return {
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPage: Math.ceil(total / Number(limit)),
        },
        data: result,
    };
});
const getPurchaseByIdDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.memberAccessoryPurchase.findUnique({
        where: { id },
        include: { user: true, mosque: true },
    });
});
const updatePurchaseDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.memberAccessoryPurchase.update({
        where: { id },
        data: payload,
    });
});
const deletePurchaseDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id);
    const isExist = yield prisma_1.default.memberAccessoryPurchase.findUnique({
        where: { id },
    });
    if (!isExist)
        throw new Error("Purchase record not found");
    return yield prisma_1.default.memberAccessoryPurchase.delete({ where: { id } });
});
exports.accessoryPurchaseServices = {
    createPurchaseDB,
    getAllPurchasesDB,
    getPurchaseByIdDB,
    updatePurchaseDB,
    deletePurchaseDB,
};
