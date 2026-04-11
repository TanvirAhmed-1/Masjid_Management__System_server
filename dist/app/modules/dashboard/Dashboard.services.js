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
exports.DashboardServices = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
/**
 * Returns { gte, lte } date range based on filter mode.
 * Used in all where clauses that filter by date.
 */
function buildDateRange(filter) {
    const { mode, date, month, year } = filter;
    if (mode === "date" && date) {
        const d = new Date(date);
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
        const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
        return { gte: start, lte: end };
    }
    if (mode === "month" && month && year) {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);
        return { gte: start, lte: end };
    }
    if (mode === "year" && year) {
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31, 23, 59, 59);
        return { gte: start, lte: end };
    }
    return null; // no filter → all time
}
/**
 * Builds a monthKey string like "2026-04" for Payment queries.
 * Returns null when filter mode is "year" or "date" (not month-specific).
 */
function buildMonthKey(filter) {
    if (filter.mode === "month" && filter.month && filter.year) {
        return `${filter.year}-${String(filter.month).padStart(2, "0")}`;
    }
    return null;
}
// ===================== DASHBOARD STATS (filtered) =====================
const getDashboardStatsDB = (mosqueId, filter) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const now = new Date();
    // fallback: current month when no filter
    const activeFilter = filter !== null && filter !== void 0 ? filter : {
        mode: "month",
        month: now.getMonth() + 1,
        year: now.getFullYear(),
    };
    const dateRange = buildDateRange(activeFilter);
    const monthKey = buildMonthKey(activeFilter);
    // For "unpaid this month" we always need a concrete monthKey
    const currentMonthKey = monthKey !== null && monthKey !== void 0 ? monthKey : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    // Date range for last month (growth comparison – only meaningful in month mode)
    const lastMonthFilter = {
        mode: "month",
        month: activeFilter.month ? activeFilter.month - 1 || 12 : now.getMonth(),
        year: activeFilter.month === 1
            ? ((_a = activeFilter.year) !== null && _a !== void 0 ? _a : now.getFullYear()) - 1
            : (_b = activeFilter.year) !== null && _b !== void 0 ? _b : now.getFullYear(),
    };
    const lastMonthRange = buildDateRange(lastMonthFilter);
    const [totalMembers, totalStaff, activeStaff, fridayAgg, memberPayAgg, lastMonthPayAgg, salaryAgg, purchaseAgg, otherCollCount, ramadanDoners, upcomingDues,] = yield Promise.all([
        prisma_1.default.member.count({ where: { mosqueId } }),
        prisma_1.default.staff.count({ where: { mosqueId } }),
        prisma_1.default.staff.count({ where: { mosqueId, active: true } }),
        // Friday collections
        prisma_1.default.fridayCollection.aggregate({
            where: Object.assign({ mosqueId }, (dateRange ? { collectionDate: dateRange } : {})),
            _sum: { amount: true },
            _count: true,
        }),
        // Member payments
        prisma_1.default.payment.aggregate({
            where: Object.assign({ mosqueId }, (monthKey
                ? { monthKey }
                : dateRange
                    ? { paidDate: dateRange }
                    : {})),
            _sum: { amount: true },
            _count: true,
        }),
        // Last month payments (for growth %)
        prisma_1.default.payment.aggregate({
            where: Object.assign({ mosqueId }, (lastMonthRange ? { paidDate: lastMonthRange } : {})),
            _sum: { amount: true },
        }),
        // Salary payments
        prisma_1.default.salaryPayment.aggregate({
            where: Object.assign({ mosqueId }, (dateRange ? { payDate: dateRange } : {})),
            _sum: { amount: true },
        }),
        // Purchases
        prisma_1.default.memberAccessoryPurchase.aggregate({
            where: Object.assign({ mosqueId }, (dateRange ? { purchaseDate: dateRange } : {})),
            _sum: { totalPrice: true },
            _count: true,
        }),
        // Other collections count
        prisma_1.default.otherCollection.count({
            where: Object.assign({ mosqueId }, (dateRange ? { createdAt: dateRange } : {})),
        }),
        // Ramadan donors
        prisma_1.default.doner.count({ where: { mosqueId } }),
        // Unpaid members this period
        prisma_1.default.member.findMany({
            where: {
                mosqueId,
                payments: { none: { monthKey: currentMonthKey } },
            },
            select: { id: true, name: true, phone: true, monthlyAmount: true },
            take: 5,
        }),
    ]);
    const totalIncome = ((_c = fridayAgg._sum.amount) !== null && _c !== void 0 ? _c : 0) + ((_d = memberPayAgg._sum.amount) !== null && _d !== void 0 ? _d : 0);
    const totalExpense = ((_e = salaryAgg._sum.amount) !== null && _e !== void 0 ? _e : 0) + ((_f = purchaseAgg._sum.totalPrice) !== null && _f !== void 0 ? _f : 0);
    const net = totalIncome - totalExpense;
    const lastMonthIncome = (_g = lastMonthPayAgg._sum.amount) !== null && _g !== void 0 ? _g : 0;
    const incomeGrowth = lastMonthIncome > 0
        ? ((((_h = memberPayAgg._sum.amount) !== null && _h !== void 0 ? _h : 0) - lastMonthIncome) / lastMonthIncome) * 100
        : 0;
    return {
        filter: activeFilter,
        overview: {
            totalIncome: Number(totalIncome.toFixed(2)),
            totalExpense: Number(totalExpense.toFixed(2)),
            netBalance: Number(net.toFixed(2)),
            isProfit: net >= 0,
            incomeGrowthPercent: Number(incomeGrowth.toFixed(1)),
        },
        collections: {
            friday: {
                total: Number(((_j = fridayAgg._sum.amount) !== null && _j !== void 0 ? _j : 0).toFixed(2)),
                count: fridayAgg._count,
            },
            member: {
                total: Number(((_k = memberPayAgg._sum.amount) !== null && _k !== void 0 ? _k : 0).toFixed(2)),
                count: memberPayAgg._count,
            },
            other: { count: otherCollCount },
        },
        expenses: {
            salary: Number(((_l = salaryAgg._sum.amount) !== null && _l !== void 0 ? _l : 0).toFixed(2)),
            purchase: Number(((_m = purchaseAgg._sum.totalPrice) !== null && _m !== void 0 ? _m : 0).toFixed(2)),
            total: Number(totalExpense.toFixed(2)),
        },
        members: {
            total: totalMembers,
            unpaidThisPeriod: totalMembers - ((_o = memberPayAgg._count) !== null && _o !== void 0 ? _o : 0),
            upcomingDues,
        },
        staff: {
            total: totalStaff,
            active: activeStaff,
        },
        ramadan: { totalDoners: ramadanDoners },
    };
});
// ===================== FILTERED COLLECTIONS =====================
const getFilteredCollectionsDB = (mosqueId, filter, type) => __awaiter(void 0, void 0, void 0, function* () {
    const dateRange = buildDateRange(filter);
    const monthKey = buildMonthKey(filter);
    const results = {};
    if (type === "friday" || type === "all") {
        results.friday = yield prisma_1.default.fridayCollection.findMany({
            where: Object.assign({ mosqueId }, (dateRange ? { collectionDate: dateRange } : {})),
            include: { user: { select: { name: true } } },
            orderBy: { collectionDate: "desc" },
        });
    }
    if (type === "member" || type === "all") {
        results.member = yield prisma_1.default.payment.findMany({
            where: Object.assign({ mosqueId }, (monthKey
                ? { monthKey }
                : dateRange
                    ? { paidDate: dateRange }
                    : {})),
            include: {
                member: { select: { name: true, phone: true } },
                user: { select: { name: true } },
            },
            orderBy: { paidDate: "desc" },
        });
    }
    if (type === "other" || type === "all") {
        results.other = yield prisma_1.default.otherCollection.findMany({
            where: Object.assign({ mosqueId }, (dateRange ? { createdAt: dateRange } : {})),
            include: {
                otherCollectionName: { select: { title: true } },
                donors: true,
                user: { select: { name: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    return results;
});
// ===================== FILTERED EXPENSES =====================
const getFilteredExpensesDB = (mosqueId, filter, type) => __awaiter(void 0, void 0, void 0, function* () {
    const dateRange = buildDateRange(filter);
    const results = {};
    if (type === "salary" || type === "all") {
        results.salary = yield prisma_1.default.salaryPayment.findMany({
            where: Object.assign({ mosqueId }, (dateRange ? { payDate: dateRange } : {})),
            include: {
                salary: {
                    include: { staff: { select: { name: true, role: true } } },
                },
            },
            orderBy: { payDate: "desc" },
        });
    }
    if (type === "purchase" || type === "all") {
        results.purchase = yield prisma_1.default.memberAccessoryPurchase.findMany({
            where: Object.assign({ mosqueId }, (dateRange ? { purchaseDate: dateRange } : {})),
            include: { user: { select: { name: true } } },
            orderBy: { purchaseDate: "desc" },
        });
    }
    if (type === "tarabi" || type === "all") {
        results.tarabi = yield prisma_1.default.ramadanTarabiPayment.findMany({
            where: Object.assign({ mosqueId }, (dateRange ? { payDate: dateRange } : {})),
            include: {
                member: { select: { name: true } },
                ramadanYear: { select: { ramadanYear: true } },
            },
            orderBy: { payDate: "desc" },
        });
    }
    return results;
});
// ===================== MONTHLY CHART =====================
const getMonthlyCollectionChartDB = (mosqueId, year) => __awaiter(void 0, void 0, void 0, function* () {
    const months = Array.from({ length: 12 }, (_, i) => i);
    const chartData = yield Promise.all(months.map((monthIndex) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const start = new Date(year, monthIndex, 1);
        const end = new Date(year, monthIndex + 1, 0, 23, 59, 59);
        const monthKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
        const [friday, member, salary, purchase] = yield Promise.all([
            prisma_1.default.fridayCollection.aggregate({
                where: { mosqueId, collectionDate: { gte: start, lte: end } },
                _sum: { amount: true },
            }),
            prisma_1.default.payment.aggregate({
                where: { mosqueId, monthKey },
                _sum: { amount: true },
            }),
            prisma_1.default.salaryPayment.aggregate({
                where: { mosqueId, payDate: { gte: start, lte: end } },
                _sum: { amount: true },
            }),
            prisma_1.default.memberAccessoryPurchase.aggregate({
                where: { mosqueId, purchaseDate: { gte: start, lte: end } },
                _sum: { totalPrice: true },
            }),
        ]);
        const income = ((_a = friday._sum.amount) !== null && _a !== void 0 ? _a : 0) + ((_b = member._sum.amount) !== null && _b !== void 0 ? _b : 0);
        const expense = ((_c = salary._sum.amount) !== null && _c !== void 0 ? _c : 0) + ((_d = purchase._sum.totalPrice) !== null && _d !== void 0 ? _d : 0);
        return {
            month: new Date(year, monthIndex).toLocaleString("default", { month: "short" }),
            monthIndex: monthIndex + 1,
            fridayCollection: Number(((_e = friday._sum.amount) !== null && _e !== void 0 ? _e : 0).toFixed(2)),
            memberPayments: Number(((_f = member._sum.amount) !== null && _f !== void 0 ? _f : 0).toFixed(2)),
            totalIncome: Number(income.toFixed(2)),
            salaryExpense: Number(((_g = salary._sum.amount) !== null && _g !== void 0 ? _g : 0).toFixed(2)),
            purchaseExpense: Number(((_h = purchase._sum.totalPrice) !== null && _h !== void 0 ? _h : 0).toFixed(2)),
            totalExpense: Number(expense.toFixed(2)),
            net: Number((income - expense).toFixed(2)),
        };
    })));
    return {
        year,
        data: chartData,
        summary: {
            totalIncome: chartData.reduce((s, d) => s + d.totalIncome, 0),
            totalExpense: chartData.reduce((s, d) => s + d.totalExpense, 0),
            netBalance: chartData.reduce((s, d) => s + d.net, 0),
        },
    };
});
// ===================== RECENT ACTIVITIES =====================
const getRecentActivitiesDB = (mosqueId, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const perSource = Math.max(3, Math.floor(limit / 4));
    const [recentFriday, recentPayments, recentPurchases, recentMembers, recentStaff] = yield Promise.all([
        prisma_1.default.fridayCollection.findMany({
            where: { mosqueId },
            orderBy: { createdAt: "desc" },
            take: perSource,
            include: { user: { select: { name: true } } },
        }),
        prisma_1.default.payment.findMany({
            where: { mosqueId },
            orderBy: { createdAt: "desc" },
            take: perSource,
            include: {
                member: { select: { name: true } },
                user: { select: { name: true } },
            },
        }),
        prisma_1.default.memberAccessoryPurchase.findMany({
            where: { mosqueId },
            orderBy: { createdAt: "desc" },
            take: perSource,
            include: { user: { select: { name: true } } },
        }),
        prisma_1.default.member.findMany({
            where: { mosqueId },
            orderBy: { createdAt: "desc" },
            take: perSource,
            include: { user: { select: { name: true } } },
        }),
        prisma_1.default.staff.findMany({
            where: { mosqueId },
            orderBy: { createdAt: "desc" },
            take: perSource,
        }),
    ]);
    const activities = [];
    recentFriday.forEach((fc) => {
        var _a;
        activities.push({
            id: fc.id, type: "friday_collection", title: "Friday Collection",
            description: `Collected on ${new Date(fc.collectionDate).toLocaleDateString()}`,
            amount: fc.amount, date: fc.createdAt, by: (_a = fc.user) === null || _a === void 0 ? void 0 : _a.name, badge: "income",
        });
    });
    recentPayments.forEach((p) => {
        var _a, _b;
        activities.push({
            id: p.id, type: "member_payment", title: "Member Payment",
            description: `${(_a = p.member) === null || _a === void 0 ? void 0 : _a.name} paid for ${p.monthKey}`,
            amount: p.amount, date: p.createdAt, by: (_b = p.user) === null || _b === void 0 ? void 0 : _b.name, badge: "income",
        });
    });
    recentPurchases.forEach((pur) => {
        var _a;
        activities.push({
            id: pur.id, type: "purchase", title: "Purchase",
            description: `${pur.itemName} (x${pur.quantity})`,
            amount: pur.totalPrice, date: pur.createdAt, by: (_a = pur.user) === null || _a === void 0 ? void 0 : _a.name, badge: "expense",
        });
    });
    recentMembers.forEach((m) => {
        var _a;
        activities.push({
            id: m.id, type: "new_member", title: "New Member",
            description: `${m.name} joined the mosque`,
            date: m.createdAt, by: (_a = m.user) === null || _a === void 0 ? void 0 : _a.name, badge: "member",
        });
    });
    recentStaff.forEach((s) => {
        activities.push({
            id: s.id, type: "new_staff", title: "Staff Added",
            description: `${s.name} - ${s.role}`,
            date: s.createdAt, badge: "staff",
        });
    });
    activities.sort((a, b) => b.date.getTime() - a.date.getTime());
    return activities.slice(0, limit);
});
// ===================== MEMBER PAYMENT STATUS =====================
const getMemberPaymentStatusDB = (mosqueId, monthParam) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const now = new Date();
    const monthKey = monthParam !== null && monthParam !== void 0 ? monthParam : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const [allMembers, paidAgg] = yield Promise.all([
        prisma_1.default.member.findMany({
            where: { mosqueId },
            select: {
                id: true, name: true, phone: true, monthlyAmount: true,
                payments: {
                    where: { monthKey },
                    select: { id: true, amount: true, paidDate: true, monthKey: true },
                },
            },
            orderBy: { name: "asc" },
        }),
        prisma_1.default.payment.aggregate({
            where: { mosqueId, monthKey },
            _sum: { amount: true },
            _count: true,
        }),
    ]);
    const paid = allMembers.filter((m) => m.payments.length > 0);
    const unpaid = allMembers.filter((m) => m.payments.length === 0);
    const expectedTotal = allMembers.reduce((s, m) => s + m.monthlyAmount, 0);
    const collectedTotal = (_a = paidAgg._sum.amount) !== null && _a !== void 0 ? _a : 0;
    return {
        monthKey,
        summary: {
            totalMembers: allMembers.length,
            paidCount: paid.length,
            unpaidCount: unpaid.length,
            paymentRate: allMembers.length > 0 ? Number(((paid.length / allMembers.length) * 100).toFixed(1)) : 0,
            expectedAmount: Number(expectedTotal.toFixed(2)),
            collectedAmount: Number(collectedTotal.toFixed(2)),
            pendingAmount: Number((expectedTotal - collectedTotal).toFixed(2)),
        },
        paid: paid.map((m) => {
            var _a, _b;
            return ({
                id: m.id, name: m.name, phone: m.phone, monthlyAmount: m.monthlyAmount,
                paidAmount: (_a = m.payments[0]) === null || _a === void 0 ? void 0 : _a.amount, paidDate: (_b = m.payments[0]) === null || _b === void 0 ? void 0 : _b.paidDate,
            });
        }),
        unpaid: unpaid.map((m) => ({ id: m.id, name: m.name, phone: m.phone, monthlyAmount: m.monthlyAmount })),
    };
});
// ===================== STAFF SALARY OVERVIEW =====================
const getStaffSalaryOverviewDB = (mosqueId) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const currentMonthKey = new Date(now.getFullYear(), now.getMonth(), 1);
    const staffList = yield prisma_1.default.staff.findMany({
        where: { mosqueId, active: true },
        include: {
            salaries: {
                where: { month: currentMonthKey },
                include: { payments: { select: { amount: true, payDate: true } } },
            },
        },
        orderBy: { name: "asc" },
    });
    const overview = staffList.map((staff) => {
        var _a, _b;
        const salary = staff.salaries[0];
        const paid = salary ? salary.payments.reduce((s, p) => s + p.amount, 0) : 0;
        const due = salary ? salary.totalSalary - paid : staff.baseSalary;
        return {
            id: staff.id, name: staff.name, role: staff.role,
            baseSalary: staff.baseSalary,
            thisMonthTotal: (_a = salary === null || salary === void 0 ? void 0 : salary.totalSalary) !== null && _a !== void 0 ? _a : staff.baseSalary,
            paid: Number(paid.toFixed(2)),
            due: Number(due.toFixed(2)),
            status: paid >= ((_b = salary === null || salary === void 0 ? void 0 : salary.totalSalary) !== null && _b !== void 0 ? _b : staff.baseSalary) ? "PAID" : paid > 0 ? "PARTIAL" : "UNPAID",
        };
    });
    return {
        month: currentMonthKey,
        staffCount: staffList.length,
        totalSalaryDue: overview.reduce((s, o) => s + o.thisMonthTotal, 0),
        totalPaid: overview.reduce((s, o) => s + o.paid, 0),
        totalDue: overview.reduce((s, o) => s + o.due, 0),
        staff: overview,
    };
});
exports.DashboardServices = {
    getDashboardStatsDB,
    getFilteredCollectionsDB,
    getFilteredExpensesDB,
    getMonthlyCollectionChartDB,
    getRecentActivitiesDB,
    getMemberPaymentStatusDB,
    getStaffSalaryOverviewDB,
};
