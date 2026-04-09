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
exports.paymentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const payment_services_1 = require("./payment.services");
const createPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user.id;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield payment_services_1.paymentService.createPayment(Object.assign(Object.assign({}, req.body), { userId,
        mosqueId }));
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "payment created successfully",
        data: result,
    });
}));
const getMemberSummary = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { memberId } = req.params;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield payment_services_1.paymentService.getMemberPaymentSummary({
        memberId,
        mosqueId,
    });
    res.status(http_status_1.default.OK).json({
        success: true,
        message: " successfully fetching Member payment summary",
        data: result,
    });
}));
const getYearlyReport = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const year = req.params.year;
    const { page, limit } = req.query;
    const result = yield payment_services_1.paymentService.getYearlyCollection({
        year,
        mosqueId,
        page: Number(page),
        limit: Number(limit),
    });
    res.status(http_status_1.default.OK).json({
        success: true,
        message: `Successfully fetched year base payment`,
        data: result,
    });
}));
const getAllPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield payment_services_1.paymentService.getAllPayments(Object.assign(Object.assign({}, req.query), { mosqueId }));
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Successfully fetched all payments",
        data: result,
    });
}));
const updatePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const { memberId, monthKey, amount } = req.body;
    const result = yield payment_services_1.paymentService.updatePaymentDB({
        id,
        mosqueId,
        data: { memberId, monthKey, amount },
    });
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Successfully updated payment",
        data: result,
    });
}));
const deletePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const paymentId = req.params.paymentId;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield payment_services_1.paymentService.deletePaymentBD(paymentId, mosqueId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Successfully deleted payment",
        data: result,
    });
}));
exports.paymentController = {
    createPayment,
    getMemberSummary,
    getYearlyReport,
    getAllPayments,
    updatePayment,
    deletePayment,
};
