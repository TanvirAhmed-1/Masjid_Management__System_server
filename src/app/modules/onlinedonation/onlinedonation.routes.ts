import { Router } from "express";
import { onlineDonationController } from "./onlinedonation.controller";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();

// ১. Public Route: পেমেন্ট ক্রিয়েট করার জন্য (ডোনাররা এটি ব্যবহার করবে)
router.post("/create-payment", onlineDonationController.createOnlineDonation);
router.get(
  "/bkash-credentials",
  onlineDonationController.getBkashCredentialCollection,
);
// ২. Admin Routes: সেটিংস এবং হিস্ট্রি দেখার জন্য
router.post(
  "/bkash-credentials",
  auth("ADMIN", "SUPER_ADMIN"),
  onlineDonationController.saveBkashCredentials,
);

router.get(
  "/history",
  auth("ADMIN", "SUPER_ADMIN"),
  onlineDonationController.getDonationHistory,
);

router.delete(
  "/bkash-credentials",
  auth("ADMIN", "SUPER_ADMIN"),
  onlineDonationController.deleteBkashCredentials,
);

// ৩. Public Callback: bKash থেকে অটো-রিডাইরেক্ট হবে
router.get("/callback", onlineDonationController.handlePaymentCallback);

export const onlineDonationRoutes = router;
