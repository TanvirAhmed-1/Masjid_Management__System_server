import { Router } from "express";
import validateRequest from "../../../middlewares/validateRequest";
import { RamadanTarabiPaymentValidation } from "./ramadan-tarabi-salary.validation";
import { auth } from "../../../middlewares/auth.middleware";
import { ramadanTarabiPaymentController } from "./ramadan-tarabi-salary.controller";

const router = Router();

router.use(auth());

router.post(
  "/tarabi-payments",
  validateRequest(RamadanTarabiPaymentValidation.create),
  ramadanTarabiPaymentController.createPayment
);

router.get("/tarabi-payments", ramadanTarabiPaymentController.getAllPayments);

router.get("/tarabi-payments/:id", ramadanTarabiPaymentController.getPaymentById);

router.put(
  "/tarabi-payments/:id",
  validateRequest(RamadanTarabiPaymentValidation.update),
  ramadanTarabiPaymentController.updatePayment
);

router.delete("/tarabi-payments/:id", ramadanTarabiPaymentController.deletePayment);

export const ramadanTarabiPaymentRoutes = router;