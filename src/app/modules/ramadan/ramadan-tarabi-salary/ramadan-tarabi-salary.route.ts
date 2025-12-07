import { Router } from "express";
import { ramadanIftarSalaryController } from "./ramadan-tarabi-salary.controller";
import { auth } from "../../../middlewares/auth.middleware";

const router = Router();

router.use(auth());

// Get a salary by ID
router.get(
  "/tarabi-salary/:salaryId",
  ramadanIftarSalaryController.getRamadanIftarSalary
);
// Get all salaries
router.get("/tarabi-salary", ramadanIftarSalaryController.getAllPayments);
// Create a new Ramadan Iftar Salary
router.post(
  "/tarabi-salary",
  ramadanIftarSalaryController.addRamadanIftarSalaryPayment
);

// Add a payment for a member
router.post("/tarabi-salary/payment", ramadanIftarSalaryController.addPayment);

// Update a payment
router.put(
  "/tarabi-salary/payment/:paymentId",
  ramadanIftarSalaryController.updatePayment
);

// Delete a payment
router.delete(
  "/tarabi-salary/payment/:paymentId",
  ramadanIftarSalaryController.deletePayment
);

export const ramadanTarabiSalaryRoutes = router;
