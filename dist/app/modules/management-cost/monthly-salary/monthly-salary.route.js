"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.monthlySalaryRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const monthly_salary_controller_1 = require("./monthly-salary.controller");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const monthly_salary_validation_1 = require("./monthly-salary.validation");
const route = (0, express_1.Router)();
route.use((0, auth_middleware_1.auth)());
route.post("/monthly-salaries", (0, validateRequest_1.default)(monthly_salary_validation_1.createMonthlySalaryValidation), monthly_salary_controller_1.monthlySalaryController.createMonthlySalary);
route.get("/monthly-salaries", monthly_salary_controller_1.monthlySalaryController.getAllMonthlySalaries);
route.get("/monthly-salaries/:salaryId", monthly_salary_controller_1.monthlySalaryController.getMonthlySalaryById);
route.put("/monthly-salaries/:salaryId", monthly_salary_controller_1.monthlySalaryController.updateMonthlySalary);
route.delete("/monthly-salaries/:salaryId", monthly_salary_controller_1.monthlySalaryController.deleteMonthlySalary);
exports.monthlySalaryRoutes = route;
