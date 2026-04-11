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
exports.MemberAccessoryPurchaseService = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const createPurchaseDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.memberAccessoryPurchase.create({
        data: payload,
    });
});
const fetchAllPurchasesDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.memberAccessoryPurchase.findMany({
        include: {
            user: true,
            mosque: {
                select: {
                    name: true,
                },
            },
        },
    });
});
const fetchPurchaseByIdDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.memberAccessoryPurchase.findUnique({
        where: { id },
        include: {
            user: true,
        },
    });
});
const updatePurchaseDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.memberAccessoryPurchase.findUnique({
        where: { id },
    });
    if (!existing)
        throw new Error("Purchase not found");
    return yield prisma_1.default.memberAccessoryPurchase.update({
        where: { id },
        data: payload,
    });
});
const deletePurchaseDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.memberAccessoryPurchase.findUnique({
        where: { id },
    });
    if (!existing)
        throw new Error("Purchase not found");
    return yield prisma_1.default.memberAccessoryPurchase.delete({ where: { id } });
});
exports.MemberAccessoryPurchaseService = {
    createPurchaseDB,
    fetchAllPurchasesDB,
    fetchPurchaseByIdDB,
    updatePurchaseDB,
    deletePurchaseDB,
};
