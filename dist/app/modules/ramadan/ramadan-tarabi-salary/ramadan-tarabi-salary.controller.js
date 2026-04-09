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
exports.ramadanTarabiPaymentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const ramadan_tarabi_salary_servicess_1 = require("./ramadan-tarabi-salary.servicess");
const createPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user.id;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield ramadan_tarabi_salary_servicess_1.RamadanTarabiPaymentService.createPaymentDB(Object.assign(Object.assign({}, req.body), { userId,
        mosqueId }));
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Tarabi payment recorded successfully",
        result,
    });
}));
const getAllPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield ramadan_tarabi_salary_servicess_1.RamadanTarabiPaymentService.getAllPaymentsDB(Object.assign({ mosqueId }, req.query));
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Tarabi payments fetched successfully",
        result,
    });
}));
const getPaymentById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ramadan_tarabi_salary_servicess_1.RamadanTarabiPaymentService.getPaymentByIdDB(req.params.id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Tarabi payment fetched successfully",
        result,
    });
}));
const updatePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ramadan_tarabi_salary_servicess_1.RamadanTarabiPaymentService.updatePaymentDB(req.params.id, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Tarabi payment updated successfully",
        result,
    });
}));
const deletePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield ramadan_tarabi_salary_servicess_1.RamadanTarabiPaymentService.deletePaymentDB(req.params.id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Tarabi payment deleted successfully",
        result: null,
    });
}));
exports.ramadanTarabiPaymentController = {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
};
