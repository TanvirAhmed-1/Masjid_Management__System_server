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
exports.OtherCollectionNameServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const createcollectionName = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.otherCollectionName.create({
        data: data,
    });
});
const getAllCollectionName = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { mosqueId, page = 1, limit = 30, sortBy = "createdAt", sortOrder = "desc", fromDate, toDate, } = query;
    if (!mosqueId) {
        throw new Error("Mosque ID is required");
    }
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    // Where condition
    const whereCondition = { mosqueId };
    if (fromDate && toDate) {
        whereCondition.collectionDate = {
            gte: new Date(fromDate),
            lte: new Date(toDate),
        };
    }
    // Fetch data
    const data = yield prisma_1.default.otherCollectionName.findMany({
        where: whereCondition,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take,
    });
    // Total count
    const total = yield prisma_1.default.otherCollectionName.count({
        where: whereCondition,
    });
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPage: Math.ceil(total / Number(limit)) || 1,
        },
        data,
    };
});
const deletecollectionName = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const collectionName = yield prisma_1.default.otherCollectionName.findUnique({
        where: { id },
    });
    if (!collectionName)
        throw new Error("Collection Name id not found");
    return yield prisma_1.default.otherCollectionName.delete({
        where: { id },
    });
});
const updatecollectionName = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const isExits = yield prisma_1.default.otherCollectionName.findUnique({
        where: { id },
    });
    if (!isExits)
        throw new Error("Collection Name id not found");
    return yield prisma_1.default.otherCollectionName.update({
        where: { id },
        data: data,
    });
});
exports.OtherCollectionNameServices = {
    createcollectionName,
    getAllCollectionName,
    deletecollectionName,
    updatecollectionName,
};
