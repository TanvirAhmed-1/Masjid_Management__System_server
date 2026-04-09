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
exports.monthlySalaryController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const monthly_salary_services_1 = require("./monthly-salary.services");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const createMonthlySalary = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const data = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const mosqueId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.mosqueId;
    const result = yield monthly_salary_services_1.monthlySalaryServices.createMonthlySalary(data, userId, mosqueId);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Monthly Salary created successfully",
        result,
    });
}));
const getAllMonthlySalaries = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield monthly_salary_services_1.monthlySalaryServices.getAllMonthlySalaries(Object.assign({ mosqueId }, req.query));
    res.json({
        success: true,
        message: "Monthly salaries fetched successfully",
        result,
    });
}));
const getMonthlySalaryById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { salaryId } = req.params;
    const result = yield monthly_salary_services_1.monthlySalaryServices.getMonthlySalaryById(salaryId);
    res.json({
        success: true,
        message: "Monthly salary fetched successfully",
        result,
    });
}));
const updateMonthlySalary = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { salaryId } = req.params;
    const data = req.body;
    const result = yield monthly_salary_services_1.monthlySalaryServices.updateMonthlySalary(salaryId, data);
    res.json({
        success: true,
        message: "Monthly salary updated successfully",
        result,
    });
}));
const deleteMonthlySalary = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { salaryId } = req.params;
    yield monthly_salary_services_1.monthlySalaryServices.deleteMonthlySalary(salaryId);
    res.json({
        success: true,
        message: "Monthly salary deleted successfully",
    });
}));
exports.monthlySalaryController = {
    createMonthlySalary,
    getAllMonthlySalaries,
    getMonthlySalaryById,
    updateMonthlySalary,
    deleteMonthlySalary,
};
