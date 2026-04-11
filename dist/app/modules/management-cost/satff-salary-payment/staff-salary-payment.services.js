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
exports.staffSalaryPaymentServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const createSalaryPaymentDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { salaryId, userId, mosqueId } = payload;
    if (!salaryId)
        throw new Error("Salary ID is required");
    if (!userId)
        throw new Error("User ID is required");
    if (!mosqueId)
        throw new Error("Mosque ID is required");
    const isExisting = yield prisma_1.default.staff.findFirst({
        where: {
            id: salaryId,
        },
    });
    if (!isExisting) {
        throw new Error("Salary Payment already exists for this salary");
    }
    return yield prisma_1.default.salaryPayment.create({ data: payload });
});
const getAllSalaryPaymentDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { mosqueId, limit = 20, page = 1, sortBy = "createdAt", sortOrder = "desc", name, phone, fromDate, toDate, } = query;
    if (!mosqueId)
        throw new Error("Mosque ID is required");
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const whereCondition = { mosqueId };
    if (name) {
        whereCondition.staff = {
            name: {
                contains: name,
                mode: "insensitive",
            },
        };
    }
    if (phone) {
        whereCondition.staff = {
            phone: {
                contains: phone,
                mode: "insensitive",
            },
        };
    }
    if (fromDate && toDate) {
        whereCondition.paidDate = {
            gte: new Date(fromDate),
            lte: new Date(toDate),
        };
    }
    const result = yield prisma_1.default.salaryPayment.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            mosque: {
                select: {
                    name: true
                }
            }
        }
    });
    const total = yield prisma_1.default.salaryPayment.count({ where: whereCondition });
    return {
        meta: {
            total,
            page,
            limit,
            totalPage: Math.ceil(total / Number(limit)),
        },
        data: result,
    };
});
const updateSalaryPaymentDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Id is required");
    return yield prisma_1.default.salaryPayment.update({
        where: { id },
        data: payload,
    });
});
const deleteSalaryPaymentDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Id is required");
    const payment = yield prisma_1.default.salaryPayment.findUnique({ where: { id } });
    if (!payment)
        throw new Error("Salary Payment not found");
    return yield prisma_1.default.salaryPayment.delete({ where: { id } });
});
exports.staffSalaryPaymentServices = {
    createSalaryPaymentDB,
    updateSalaryPaymentDB,
    getAllSalaryPaymentDB,
    deleteSalaryPaymentDB,
};
