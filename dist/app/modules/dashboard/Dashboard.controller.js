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
exports.DashboardController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Dashboard_services_1 = require("./Dashboard.services");
// ─── helper ────────────────────────────────────────────────────────────────
/**
 * Parses query params into a typed DateFilter object.
 *
 * Accepted query params:
 *   mode   = "date" | "month" | "year"   (default: "month")
 *   date   = "YYYY-MM-DD"                (when mode=date)
 *   month  = 1-12                         (when mode=month)
 *   year   = e.g. 2026                   (when mode=month or year)
 */
function parseFilter(query) {
    const mode = query.mode || "month";
    const now = new Date();
    return {
        mode: mode,
        date: query.date,
        month: query.month ? Number(query.month) : mode === "month" ? now.getMonth() + 1 : undefined,
        year: query.year ? Number(query.year) : now.getFullYear(),
    };
}
function mosqueGuard(req, res) {
    var _a;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    if (!mosqueId) {
        res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: "Mosque not found in token",
        });
        return null;
    }
    return mosqueId;
}
// ─── controllers ───────────────────────────────────────────────────────────
/**
 * GET /dashboard/stats
 * Query: mode, date, month, year
 *
 * Returns financial overview (revenue, expense, net) for the given period.
 */
const getDashboardStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mosqueId = mosqueGuard(req, res);
    if (!mosqueId)
        return;
    const filter = parseFilter(req.query);
    const result = yield Dashboard_services_1.DashboardServices.getDashboardStatsDB(mosqueId, filter);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Dashboard statistics fetched successfully",
        data: result,
    });
}));
/**
 * GET /dashboard/collections
 * Query: mode, date, month, year, type (friday | member | other | all)
 *
 * Returns raw collection records filtered by date period.
 */
const getFilteredCollections = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mosqueId = mosqueGuard(req, res);
    if (!mosqueId)
        return;
    const filter = parseFilter(req.query);
    const type = req.query.type || "all";
    if (!["friday", "member", "other", "all"].includes(type)) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: "Invalid type. Use: friday | member | other | all",
        });
    }
    const result = yield Dashboard_services_1.DashboardServices.getFilteredCollectionsDB(mosqueId, filter, type);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Collections fetched successfully",
        data: result,
    });
}));
/**
 * GET /dashboard/expenses
 * Query: mode, date, month, year, type (salary | purchase | tarabi | all)
 *
 * Returns raw expense records filtered by date period.
 */
const getFilteredExpenses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mosqueId = mosqueGuard(req, res);
    if (!mosqueId)
        return;
    const filter = parseFilter(req.query);
    const type = req.query.type || "all";
    if (!["salary", "purchase", "tarabi", "all"].includes(type)) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: "Invalid type. Use: salary | purchase | tarabi | all",
        });
    }
    const result = yield Dashboard_services_1.DashboardServices.getFilteredExpensesDB(mosqueId, filter, type);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Expenses fetched successfully",
        data: result,
    });
}));
/**
 * GET /dashboard/chart/monthly
 * Query: year
 */
const getMonthlyCollectionChart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mosqueId = mosqueGuard(req, res);
    if (!mosqueId)
        return;
    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
    const result = yield Dashboard_services_1.DashboardServices.getMonthlyCollectionChartDB(mosqueId, year);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Monthly collection chart data fetched successfully",
        data: result,
    });
}));
/**
 * GET /dashboard/activities
 * Query: limit (default 10)
 */
const getRecentActivities = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mosqueId = mosqueGuard(req, res);
    if (!mosqueId)
        return;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const result = yield Dashboard_services_1.DashboardServices.getRecentActivitiesDB(mosqueId, limit);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Recent activities fetched successfully",
        data: result,
    });
}));
/**
 * GET /dashboard/members/payment-status
 * Query: month (YYYY-MM, default current month)
 */
const getMemberPaymentStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mosqueId = mosqueGuard(req, res);
    if (!mosqueId)
        return;
    const month = req.query.month;
    const result = yield Dashboard_services_1.DashboardServices.getMemberPaymentStatusDB(mosqueId, month);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Member payment status fetched successfully",
        data: result,
    });
}));
/**
 * GET /dashboard/staff/salary-overview
 */
const getStaffSalaryOverview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const mosqueId = mosqueGuard(req, res);
    if (!mosqueId)
        return;
    const result = yield Dashboard_services_1.DashboardServices.getStaffSalaryOverviewDB(mosqueId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Staff salary overview fetched successfully",
        data: result,
    });
}));
exports.DashboardController = {
    getDashboardStats,
    getFilteredCollections,
    getFilteredExpenses,
    getMonthlyCollectionChart,
    getRecentActivities,
    getMemberPaymentStatus,
    getStaffSalaryOverview,
};
