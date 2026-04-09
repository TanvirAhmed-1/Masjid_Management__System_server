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
exports.paymentService = void 0;
// src/modules/payment/payment.service.ts
const prisma_1 = __importDefault(require("../../../utils/prisma"));
class PaymentService {
    createPayment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { mosqueId, userId, memberId } = payload;
            if (!userId) {
                throw new Error("User ID is required");
            }
            if (!mosqueId) {
                throw new Error("Mosque ID is required");
            }
            const { monthKey, amount } = payload;
            // Check if member exists
            const member = yield prisma_1.default.member.findUnique({
                where: { id: memberId },
            });
            if (!member)
                throw new Error("Member not found");
            const alreadyPaid = yield prisma_1.default.payment.findUnique({
                where: {
                    mosqueId,
                    memberId_monthKey: { memberId, monthKey },
                },
            });
            if (alreadyPaid) {
                throw new Error(`Payment for ${monthKey} has already been made`);
            }
            return yield prisma_1.default.payment.create({
                data: {
                    memberId,
                    monthKey,
                    amount,
                    userId,
                    mosqueId,
                },
                include: {
                    member: {
                        select: { name: true, phone: true, monthlyAmount: true },
                    },
                },
            });
        });
    }
    getMemberPaymentSummary(_a) {
        return __awaiter(this, arguments, void 0, function* ({ memberId, mosqueId, }) {
            if (!memberId)
                throw new Error("Member ID is required");
            if (!mosqueId)
                throw new Error("Mosque ID is required");
            const member = yield prisma_1.default.member.findUnique({
                where: { id: memberId, mosqueId: mosqueId },
                include: {
                    payments: {
                        orderBy: { monthKey: "desc" },
                    },
                },
            });
            if (!member)
                throw new Error("Member not found");
            const now = new Date();
            const joinYear = member.createdAt.getFullYear();
            const joinMonth = member.createdAt.getMonth(); // 0-indexed
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();
            const totalMonthsShouldPay = (currentYear - joinYear) * 12 + (currentMonth - joinMonth) + 1;
            const paidMonths = member.payments.length;
            const dueMonths = totalMonthsShouldPay - paidMonths;
            const totalDue = dueMonths * member.monthlyAmount;
            const paidMonthKeys = member.payments.map((p) => p.monthKey);
            return {
                member: {
                    id: member.id,
                    name: member.name,
                    phone: member.phone,
                    monthlyAmount: member.monthlyAmount,
                    joinDate: member.createdAt,
                },
                totalMonthsShouldPay,
                paidMonths,
                dueMonths,
                totalDue,
                paidMonthKeys,
                payments: member.payments,
            };
        });
    }
    getYearlyCollection(_a) {
        return __awaiter(this, arguments, void 0, function* ({ year, mosqueId, page, limit, }) {
            if (!mosqueId)
                throw new Error("Mosque ID is required");
            if (!year)
                throw new Error("Year is required");
            const safePage = Number(page) > 0 ? Number(page) : 1;
            const safeLimit = Number(limit) > 0 ? Number(limit) : 10;
            const skip = (safePage - 1) * safeLimit;
            const take = safeLimit;
            const total = yield prisma_1.default.member.count({
                where: { mosqueId },
            });
            const members = yield prisma_1.default.member.findMany({
                where: { mosqueId },
                skip,
                take,
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    monthlyAmount: true,
                    payments: {
                        where: {
                            monthKey: {
                                startsWith: year,
                            },
                        },
                        select: {
                            id: true,
                            monthKey: true,
                            amount: true,
                            paidDate: true,
                        },
                        orderBy: {
                            monthKey: "asc",
                        },
                    },
                    mosque: {
                        select: {
                            name: true,
                        },
                    },
                    tarabiPayments: {
                        where: {
                            ramadanYear: {
                                ramadanYear: year,
                            },
                        },
                        select: {
                            id: true,
                            amount: true,
                            payDate: true,
                            ramadanYear: {
                                select: {
                                    ramadanYear: true,
                                    titleName: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    name: "asc",
                },
            });
            return {
                meta: {
                    total,
                    page: safePage,
                    limit: safeLimit,
                    totalPage: Math.ceil(total / safeLimit),
                },
                result: members,
            };
        });
    }
    deletePaymentBD(paymentId, mosqueId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!paymentId) {
                throw new Error("Payment ID is required");
            }
            if (!mosqueId) {
                throw new Error("Mosque ID is required");
            }
            const payment = yield prisma_1.default.payment.findFirst({
                where: {
                    id: paymentId,
                    mosqueId,
                },
            });
            if (!payment)
                throw new Error("Payment not found");
            return yield prisma_1.default.payment.delete({ where: { id: paymentId } });
        });
    }
    updatePaymentDB(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, mosqueId, data, }) {
            if (!id)
                throw new Error("Payment ID is required");
            if (!mosqueId)
                throw new Error("Mosque ID is required");
            const existingPayment = yield prisma_1.default.payment.findFirst({
                where: {
                    id,
                    mosqueId,
                },
            });
            if (!existingPayment) {
                throw new Error("Payment not found");
            }
            if (data.memberId && data.monthKey) {
                const duplicate = yield prisma_1.default.payment.findFirst({
                    where: {
                        mosqueId,
                        memberId: data.memberId,
                        monthKey: data.monthKey,
                        NOT: { id },
                    },
                });
                if (duplicate) {
                    throw new Error(`Payment for ${data.monthKey} already exists for this member`);
                }
            }
            return yield prisma_1.default.payment.update({
                where: { id },
                data: Object.assign(Object.assign(Object.assign({}, (data.memberId && { memberId: data.memberId })), (data.monthKey && { monthKey: data.monthKey })), (data.amount !== undefined && { amount: data.amount })),
            });
        });
    }
    getAllPayments(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { mosqueId, limit = 20, page = 1, sortBy = "createdAt", sortOrder, name, phone, form, to, monthKey, } = query;
            if (!mosqueId) {
                throw new Error("Mosque ID is required");
            }
            const skip = (Number(page) - 1) * Number(limit);
            const take = Number(limit);
            const whereCondition = { mosqueId };
            if (monthKey) {
                whereCondition.monthKey = monthKey;
            }
            if (name) {
                whereCondition.member = { name: { contains: name, mode: "insensitive" } };
            }
            if (phone) {
                whereCondition.member = {
                    phone: { contains: phone, mode: "insensitive" },
                };
            }
            if (form && to) {
                whereCondition.paidDate = {
                    gte: new Date(form),
                    lte: new Date(to),
                };
            }
            const result = yield prisma_1.default.payment.findMany({
                where: whereCondition,
                skip,
                take,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    member: {
                        select: { name: true, phone: true, monthlyAmount: true, id: true },
                    },
                },
            });
            const total = yield prisma_1.default.payment.count({ where: whereCondition });
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
    }
}
exports.paymentService = new PaymentService();
