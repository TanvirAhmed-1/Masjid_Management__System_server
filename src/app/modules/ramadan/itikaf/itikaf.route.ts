import { Router } from "express";
import { auth } from "../../../middlewares/auth.middleware";
import validateRequest from "../../../middlewares/validateRequest";
import { itikafSchema } from "./itikaf.validation";
import { itikaController } from "./itikaf.controller";

const router = Router();
router.use(auth());

router.post(
  "/itikafs",
  auth(),
  validateRequest(itikafSchema),
  itikaController.createItika
);

router.get("/itikafs", itikaController.getAllItika);

router.get("/itikafs/:ramadanId", itikaController.getSingleItika);

router.put("/itikafs/:id", auth(), itikaController.updateItika);

router.delete("/itikafs/:id", auth(), itikaController.deleteItika);

export const itikaRoutes = router;
