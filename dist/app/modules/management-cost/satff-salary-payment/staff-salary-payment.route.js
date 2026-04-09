"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffSalaryPaymentRoutes = void 0;
const express_1 = require("express");
const staff_salary_payment_controller_1 = require("./staff-salary-payment.controller");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const staff_salary_payment_validation_1 = require("./staff-salary-payment.validation");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const route = (0, express_1.Router)();
route.use((0, auth_middleware_1.auth)());
route.get("/staff-salary-payments", staff_salary_payment_controller_1.staffSalaryPaymentController.getAllStaffSalaryPayments);
route.post("/staff-salary-payments", (0, validateRequest_1.default)(staff_salary_payment_validation_1.createSalaryPaymentValidation), staff_salary_payment_controller_1.staffSalaryPaymentController.createStaffSalaryPayment);
route.put("/staff-salary-payments/:id", staff_salary_payment_controller_1.staffSalaryPaymentController.updateStaffSalaryPayment);
route.delete("/staff-salary-payments/:id", staff_salary_payment_controller_1.staffSalaryPaymentController.deleteStaffSalaryPayment);
exports.staffSalaryPaymentRoutes = route;
