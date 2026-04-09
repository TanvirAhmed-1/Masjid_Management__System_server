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
exports.FridayCollectionServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const createFridayCollectionDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Normalize incoming date to YYYY-MM-DD
    const incomingDate = new Date(payload.collectionDate)
        .toISOString()
        .split("T")[0];
    // Check if already exists for that day
    const isExists = yield prisma_1.default.fridayCollection.findFirst({
        where: {
            collectionDate: {
                gte: new Date(`${incomingDate}T00:00:00.000Z`),
                lte: new Date(`${incomingDate}T23:59:59.999Z`),
            },
        },
    });
    if (isExists) {
        throw new Error("Friday Collection for this date already exists");
    }
    // Create collection
    return yield prisma_1.default.fridayCollection.create({
        data: {
            amount: payload.amount,
            collectionDate: new Date(payload.collectionDate),
            userId: payload.userId,
            mosqueId: payload.mosqueId,
        },
    });
});
const getallcollectionDB = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    const { fromDate, toDate, mosqueId, page = 1, limit = 30, sortBy = "createdAt", sortOrder = "desc", } = queryParams;
    //  mosqueId must
    if (!mosqueId) {
        throw new Error("Mosque ID is required");
    }
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    //  where condition build
    const whereCondition = {
        mosqueId,
    };
    // date filter (optional)
    if (fromDate && toDate) {
        whereCondition.collectionDate = {
            gte: new Date(fromDate),
            lte: new Date(toDate),
        };
    }
    // ✅ main query
    const data = yield prisma_1.default.fridayCollection.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
            mosque: {
                select: {
                    name: true,
                },
            },
        },
    });
    //  total count (pagination support)
    const total = yield prisma_1.default.fridayCollection.count({
        where: whereCondition,
    });
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPage: Math.ceil(total / Number(limit)),
        },
        data,
    };
});
const deleteFridayCollectionDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield prisma_1.default.fridayCollection.findUnique({
        where: { id },
    });
    if (!collection)
        throw new Error("Friday Collection id not found");
    return yield prisma_1.default.fridayCollection.delete({
        where: { id },
    });
});
const updateFridayCollectionDB = (id, payloed) => __awaiter(void 0, void 0, void 0, function* () {
    const isExits = yield prisma_1.default.fridayCollection.findUnique({
        where: { id },
    });
    if (!isExits)
        throw new Error("Friday Collection id not found");
    return yield prisma_1.default.fridayCollection.update({
        where: { id },
        data: payloed,
    });
});
exports.FridayCollectionServices = {
    createFridayCollectionDB,
    getallcollectionDB,
    deleteFridayCollectionDB,
    updateFridayCollectionDB,
};
