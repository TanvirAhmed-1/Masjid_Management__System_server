"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ramadanTarabiPaymentRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const ramadan_tarabi_salary_validation_1 = require("./ramadan-tarabi-salary.validation");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const ramadan_tarabi_salary_controller_1 = require("./ramadan-tarabi-salary.controller");
const router = (0, express_1.Router)();
router.use((0, auth_middleware_1.auth)());
router.post("/tarabi-payments", (0, validateRequest_1.default)(ramadan_tarabi_salary_validation_1.RamadanTarabiPaymentValidation.create), ramadan_tarabi_salary_controller_1.ramadanTarabiPaymentController.createPayment);
router.get("/tarabi-payments", ramadan_tarabi_salary_controller_1.ramadanTarabiPaymentController.getAllPayments);
router.get("/tarabi-payments/:id", ramadan_tarabi_salary_controller_1.ramadanTarabiPaymentController.getPaymentById);
router.put("/tarabi-payments/:id", (0, validateRequest_1.default)(ramadan_tarabi_salary_validation_1.RamadanTarabiPaymentValidation.update), ramadan_tarabi_salary_controller_1.ramadanTarabiPaymentController.updatePayment);
router.delete("/tarabi-payments/:id", ramadan_tarabi_salary_controller_1.ramadanTarabiPaymentController.deletePayment);
exports.ramadanTarabiPaymentRoutes = router;
