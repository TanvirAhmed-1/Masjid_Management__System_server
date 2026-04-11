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
exports.monthlySalaryServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const createMonthlySalary = (data, userId, mosqueId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mosqueId) {
        throw new Error("Mosque ID is required");
    }
    if (!userId) {
        throw new Error("User ID is required");
    }
    if (!data.staffId) {
        throw new Error("Staff ID is required");
    }
    const result = yield prisma_1.default.monthlySalary.create({
        data: {
            month: new Date(data.month),
            totalSalary: data.totalSalary,
            staff: {
                connect: {
                    id: data.staffId,
                },
            },
            user: {
                connect: {
                    id: userId,
                },
            },
            mosque: {
                connect: {
                    id: mosqueId,
                },
            },
        },
        include: {
            staff: true,
            payments: true,
        },
    });
    return result;
});
const getAllMonthlySalaries = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { mosqueId, page = 1, limit = 20, orderBy = "desc", sortBy = "createdAt", name, phone, active, } = query;
    if (!mosqueId)
        throw new Error("Mosque ID is required");
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const whereCondition = { mosqueId };
    if (name) {
        whereCondition.name = { contains: name, mode: "insensitive" };
    }
    if (phone) {
        whereCondition.phone = { contains: phone, mode: "insensitive" };
    }
    if (active) {
        whereCondition.active = active;
    }
    const result = yield prisma_1.default.monthlySalary.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: {
            [sortBy]: orderBy,
        },
        include: {
            staff: true,
            payments: true,
            mosque: {
                select: {
                    name: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.monthlySalary.count({
        where: whereCondition,
    });
    return {
        meta: {
            total,
            page,
            limit,
            totalPage: Math.ceil(total / limit),
        },
        data: result,
    };
});
const getMonthlySalaryById = (salaryId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.monthlySalary.findUnique({
        where: { id: salaryId },
        include: {
            staff: true,
            user: true,
            payments: true,
        },
    });
});
const updateMonthlySalary = (salaryId, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.monthlySalary.update({
        where: { id: salaryId },
        data,
    });
});
const deleteMonthlySalary = (salaryId) => __awaiter(void 0, void 0, void 0, function* () {
    const salary = yield prisma_1.default.monthlySalary.findUnique({
        where: { id: salaryId },
    });
    if (!salary)
        throw new Error("Monthly Salary not found");
    return yield prisma_1.default.monthlySalary.delete({ where: { id: salaryId } });
});
exports.monthlySalaryServices = {
    createMonthlySalary,
    getAllMonthlySalaries,
    getMonthlySalaryById,
    updateMonthlySalary,
    deleteMonthlySalary,
};
