import { Router } from "express";
import { paymentController } from "./payment.controller";
import validateRequest from "../../../middlewares/validateRequest";
import { PaymentValidationSchema } from "./payment.validation";

const router = Router();

router.post(
  "/payments",
  validateRequest(PaymentValidationSchema),
  paymentController.createPayment
);

router.get("/payments/monthly", paymentController.getMonthlyPayments);

router.get("/payments/summary/:memberId", paymentController.getMemberPaymentSummary);

router.get("/payments/status/all", paymentController.getAllMembersWithStatus);

router.put("/payments/:id", paymentController.updatePayment);

router.delete("/payments/:id", paymentController.deletePayment);

export const paymentRoutes = router;
