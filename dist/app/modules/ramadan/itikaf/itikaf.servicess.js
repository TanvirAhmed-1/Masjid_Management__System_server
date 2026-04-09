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
exports.itikaServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const createItikaDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.ifikafList.create({
        data: payload,
    });
    return result;
});
const getAllItikaDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { mosqueId, limit = 20, page = 1, sortBy = "createdAt", sortOrder = "desc", year, name, } = query;
    if (!mosqueId)
        throw new Error("Mosque ID is required");
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const whereCondition = { mosqueId };
    if (year) {
        whereCondition.ramadanYear = {
            is: {
                ramadanYear: year,
            },
        };
    }
    if (name) {
        whereCondition.name = {
            contains: name,
            mode: "insensitive",
        };
    }
    const result = yield prisma_1.default.ifikafList.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            ramadanYear: {
                select: {
                    ramadanYear: true,
                    titleName: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.ifikafList.count({ where: whereCondition });
    const totalPage = Math.ceil(total / Number(limit));
    return {
        meta: {
            total,
            page,
            limit,
            totalPage,
        },
        data: result,
    };
});
const getSingleItikaDB = (ramadanId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.ifikafList.findMany({
        where: { ramadanId },
    });
    return result;
});
const updateItikaDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.ifikafList.findUnique({ where: { id } });
    if (!existing)
        throw new Error("Itika record not found!");
    const result = yield prisma_1.default.ifikafList.update({
        where: { id },
        data: payload,
    });
    return result;
});
const deleteItikaDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.ifikafList.findUnique({ where: { id } });
    if (!existing)
        throw new Error("Itika record not found!");
    const result = yield prisma_1.default.ifikafList.delete({
        where: { id },
    });
    return result;
});
exports.itikaServices = {
    createItikaDB,
    getAllItikaDB,
    getSingleItikaDB,
    updateItikaDB,
    deleteItikaDB,
};
