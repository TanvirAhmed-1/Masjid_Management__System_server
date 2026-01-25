import { Router } from "express";
import { staffSalaryPaymentController } from "./staff-salary-payment.controller";
import validateRequest from "../../../middlewares/validateRequest";
import { createSalaryPaymentValidation } from "./staff-salary-payment.validation";
import { auth } from "../../../middlewares/auth.middleware";

const route = Router();
route.use(auth());
route.get(
  "/staff-salary-payments",
  staffSalaryPaymentController.getAllStaffSalaryPayments,
);
route.post(
  "/staff-salary-payments",
  validateRequest(createSalaryPaymentValidation),
  staffSalaryPaymentController.createStaffSalaryPayment,
);
route.put(
  "/staff-salary-payments/:id",
  staffSalaryPaymentController.updateStaffSalaryPayment,
);
route.delete(
  "/staff-salary-payments/:id",
  staffSalaryPaymentController.deleteStaffSalaryPayment,
);

export const staffSalaryPaymentRoutes = route;
