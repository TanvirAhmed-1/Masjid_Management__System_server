import { Router } from "express";
import { auth } from "../../../middlewares/auth.middleware";
import { monthlySalaryController } from "./monthly-salary.controller";
import validateRequest from "../../../middlewares/validateRequest";
import { createMonthlySalaryValidation } from "./monthly-salary.validation";

const route = Router();
route.use(auth());

route.post(
  "/monthly-salaries",
  validateRequest(createMonthlySalaryValidation),
  monthlySalaryController.createMonthlySalary
);
route.get("/monthly-salaries", monthlySalaryController.getAllMonthlySalaries);

route.get(
  "/monthly-salaries/:salaryId",
  monthlySalaryController.getMonthlySalaryById
);

route.put(
  "/monthly-salaries/:salaryId",
  monthlySalaryController.updateMonthlySalary
);
route.delete(
  "/monthly-salaries/:salaryId",
  monthlySalaryController.deleteMonthlySalary
);

export const monthlySalaryRoutes = route;
