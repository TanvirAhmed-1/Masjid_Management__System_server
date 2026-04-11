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
exports.dateSetUpServicess = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const createrRamadanDataSetupDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.ramadanYear.create({
        data: payload,
    });
});
const fetchRamadanDataDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { mosqueId, limit = 10, page = 1, sortBy = "createdAt", sortOrder = "desc", year, } = query;
    if (!mosqueId) {
        throw new Error("Mosque ID is required");
    }
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const whereCondition = {
        mosqueId,
    };
    // year optional filter
    if (year) {
        whereCondition.ramadanYear = year;
    }
    const data = yield prisma_1.default.ramadanYear.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_1.default.ramadanYear.count({
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
const updateRamadanDataSetupBD = (ramadanyearId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const exitstingId = yield prisma_1.default.ramadanYear.findUnique({
        where: { id: ramadanyearId },
    });
    if (!exitstingId) {
        throw new Error("Id not Exiting!");
    }
    return yield prisma_1.default.ramadanYear.update({
        where: { id: ramadanyearId },
        data: payload,
    });
});
const deleteRamadanDataSetupBD = (ramadanyearId) => __awaiter(void 0, void 0, void 0, function* () {
    const exitstingId = yield prisma_1.default.ramadanYear.findUnique({
        where: { id: ramadanyearId },
    });
    if (!exitstingId) {
        throw new Error("Id not Exiting!");
    }
    return yield prisma_1.default.ramadanYear.delete({
        where: { id: ramadanyearId },
    });
});
exports.dateSetUpServicess = {
    deleteRamadanDataSetupBD,
    updateRamadanDataSetupBD,
    fetchRamadanDataDB,
    createrRamadanDataSetupDB,
};
