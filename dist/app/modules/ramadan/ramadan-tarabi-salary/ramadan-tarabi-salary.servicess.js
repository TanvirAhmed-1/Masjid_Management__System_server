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
exports.RamadanTarabiPaymentService = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const createPaymentDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { ramadanYearId, memberId, mosqueId, paidAmount = 0, amount } = payload;
    const existing = yield prisma_1.default.ramadanTarabiPayment.findFirst({
        where: {
            ramadanYearId,
            memberId,
            mosqueId,
        },
    });
    // ✅ UPDATE
    if (existing) {
        const totalAmount = existing.amount;
        const currentPaid = existing.paidAmount;
        const newPaidAmount = currentPaid + paidAmount;
        const due = totalAmount - currentPaid;
        // ❌ ONLY greater than (not equal)
        if (paidAmount > due) {
            throw new Error(`You can pay maximum ${due} taka`);
        }
        return yield prisma_1.default.ramadanTarabiPayment.update({
            where: { id: existing.id },
            data: {
                paidAmount: newPaidAmount,
                payDate: new Date(),
            },
        });
    }
    if (paidAmount > amount) {
        throw new Error("Paid amount cannot be greater than total amount");
    }
    return yield prisma_1.default.ramadanTarabiPayment.create({
        data: payload,
    });
});
const getAllPaymentsDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { ramadanYearId, memberId, form, to, limit = 20, page = 1, sortBy = "createdAt", sortOrder = "desc", mosqueId, } = query;
    if (!mosqueId) {
        throw new Error("Mosque ID is required");
    }
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;
    const whereCondition = { mosqueId };
    if (ramadanYearId)
        whereCondition.ramadanYearId = ramadanYearId;
    if (memberId)
        whereCondition.memberId = memberId;
    if (form || to) {
        whereCondition.payDate = {};
        if (form)
            whereCondition.payDate.gte = new Date(form);
        if (to)
            whereCondition.payDate.lte = new Date(to);
    }
    const [data, total] = yield Promise.all([
        prisma_1.default.ramadanTarabiPayment.findMany({
            where: whereCondition,
            include: {
                member: true,
                ramadanYear: true,
                mosque: {
                    select: { name: true },
                },
            },
            skip,
            take: limitNumber,
            orderBy: {
                [sortBy]: sortOrder,
            },
        }),
        prisma_1.default.ramadanTarabiPayment.count({
            where: whereCondition,
        }),
    ]);
    const formattedData = data.map((item) => (Object.assign(Object.assign({}, item), { dueAmount: item.amount - item.paidAmount })));
    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPage: Math.ceil(total / limitNumber),
        },
        data: formattedData,
    };
});
const getPaymentByIdDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.ramadanTarabiPayment.findUnique({
        where: { id },
        include: { member: true, ramadanYear: true },
    });
});
const updatePaymentDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.ramadanTarabiPayment.findUnique({
        where: { id },
    });
    if (!existing)
        throw new Error("Payment not found");
    const due = existing.amount - existing.paidAmount;
    const incomingPayment = payload.paidAmount || 0;
    if (incomingPayment > due) {
        throw new Error(`You can pay maximum ${due} taka`);
    }
    const newPaidAmount = existing.paidAmount + incomingPayment;
    return yield prisma_1.default.ramadanTarabiPayment.update({
        where: { id },
        data: {
            paidAmount: newPaidAmount,
            payDate: new Date(),
        },
    });
});
const deletePaymentDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.ramadanTarabiPayment.delete({
        where: { id },
    });
});
exports.RamadanTarabiPaymentService = {
    createPaymentDB,
    getAllPaymentsDB,
    getPaymentByIdDB,
    updatePaymentDB,
    deletePaymentDB,
};
