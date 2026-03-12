import { Router } from "express";
import validateRequest from "../../../middlewares/validateRequest";
import { AccessoryPurchaseValidation } from "./accessory.validation";
import { accessoryPurchaseController } from "./accessory.controller";

const router = Router();

router.post(
  "/accessory-purchases",
  validateRequest(AccessoryPurchaseValidation.create),
  accessoryPurchaseController.createPurchase,
);

router.get("/accessory-purchases", accessoryPurchaseController.getAllPurchases);

router.get(
  "/accessory-purchases/:id",
  accessoryPurchaseController.getPurchaseById,
);

router.put(
  "/accessory-purchases/:id",
  validateRequest(AccessoryPurchaseValidation.update),
  accessoryPurchaseController.updatePurchase,
);

router.delete(
  "/accessory-purchases/:id",
  accessoryPurchaseController.deletePurchase,
);

export const accessoryPurchaseRoutes = router;
