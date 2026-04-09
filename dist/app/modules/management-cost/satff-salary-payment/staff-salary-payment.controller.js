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
exports.staffSalaryPaymentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const staff_salary_payment_services_1 = require("./staff-salary-payment.services");
const createStaffSalaryPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = Object.assign(Object.assign({}, req.body), { userId: req.user.id, mosqueId: req.user.mosqueId });
    const result = yield staff_salary_payment_services_1.staffSalaryPaymentServices.createSalaryPaymentDB(payload);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Salary payment created successfully",
        result,
    });
}));
const getAllStaffSalaryPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield staff_salary_payment_services_1.staffSalaryPaymentServices.getAllSalaryPaymentDB(Object.assign(Object.assign({}, req.query), { mosqueId }));
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "staff fetched successfully",
        result,
    });
}));
const updateStaffSalaryPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    const result = yield staff_salary_payment_services_1.staffSalaryPaymentServices.updateSalaryPaymentDB(id, data);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "staff updated successfully",
        result,
    });
}));
const deleteStaffSalaryPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield staff_salary_payment_services_1.staffSalaryPaymentServices.deleteSalaryPaymentDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "staff deleted successfully",
        result,
    });
}));
exports.staffSalaryPaymentController = {
    createStaffSalaryPayment,
    getAllStaffSalaryPayments,
    updateStaffSalaryPayment,
    deleteStaffSalaryPayment,
};
