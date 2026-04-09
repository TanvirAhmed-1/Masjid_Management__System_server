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
exports.memberServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const createMemberDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { mosqueId, phone } = payload;
    if (!mosqueId) {
        throw new Error("Mosque ID is required");
    }
    return yield prisma_1.default.member.create({ data: payload });
});
const getAllMembersDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { mosqueId, limit = 20, page = 1, sortBy = "createdAt", sortOrder = "desc", name, phone, address, } = query;
    if (!mosqueId) {
        throw new Error("Mosque ID is required");
    }
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const whereCondition = { mosqueId };
    if (name) {
        whereCondition.name = { contains: name, mode: "insensitive" };
    }
    if (phone) {
        whereCondition.phone = { contains: phone, mode: "insensitive" };
    }
    if (address) {
        whereCondition.address = { contains: address, mode: "insensitive" };
    }
    const result = yield prisma_1.default.member.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: { payments: true },
    });
    const total = yield prisma_1.default.member.count({ where: whereCondition });
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
const getMemberByIdDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.member.findUnique({
        where: { id },
        include: { payments: true },
    });
});
const updateMenberDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.member.update({
        where: { id },
        data: payload,
    });
});
const deleteMemberDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield prisma_1.default.member.findUnique({ where: { id } });
    if (!member)
        throw new Error("Member not found");
    return yield prisma_1.default.member.delete({ where: { id } });
});
exports.memberServices = {
    createMemberDB,
    getAllMembersDB,
    getMemberByIdDB,
    updateMenberDB,
    deleteMemberDB,
};
