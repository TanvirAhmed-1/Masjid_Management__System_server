import { Router } from "express";
import { auth } from "../../../middlewares/auth.middleware";
import { managementPurchaseController } from "./management-purchase.controller";
import validateRequest from "../../../middlewares/validateRequest";
import { createMemberAccessoryPurchaseValidation } from "./management-purchase.validation";

const route = Router();

route.use(auth());

route.post(
  "/accessory-purchases",
  validateRequest(createMemberAccessoryPurchaseValidation),
  managementPurchaseController.createPurchase
);
route.get("/accessory-purchases", managementPurchaseController.getAllPurchases);
route.get(
  "/accessory-purchases/:id",
  managementPurchaseController.getPurchaseById
);
route.put(
  "/accessory-purchases/:id",
  managementPurchaseController.updatePurchase
);
route.delete(
  "/accessory-purchases/:id",
  managementPurchaseController.deletePurchase
);

export const managementPurchaseRoutes = route;
