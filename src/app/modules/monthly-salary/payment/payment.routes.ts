import { Router } from "express";
import { paymentController } from "./payment.controller";
import validateRequest from "../../../middlewares/validateRequest";
import { PaymentValidation } from "./payment.validation";
import { auth } from "../../../middlewares/auth.middleware";

const router = Router();

router.use(auth());

router.post(
  "/payments",
  validateRequest(PaymentValidation.create),
  paymentController.createPayment,
);

router.get(
  "/payments/member/:memberId",

  paymentController.getMemberSummary,
);
router.get(
  "/payments/summary/:year",

  paymentController.getYearlyReport,
);
router.get("/payments", paymentController.getAllPayments);
router.put("/payments/:id", paymentController.updatePayment);
router.delete("/payments/:paymentId", paymentController.deletePayment);

export const paymentRoutes = router;
