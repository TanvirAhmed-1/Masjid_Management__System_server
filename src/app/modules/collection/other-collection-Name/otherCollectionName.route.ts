import { Router } from "express";
import { otherCollectionNameController } from "./otherCollectionName.controller";
import validateRequest from "../../../middlewares/validateRequest";
import { otherCollectionNameSchema } from "./otherCollectionName.validation";
import { auth } from "../../../middlewares/auth.middleware";

const route = Router();

route.use(auth());
route.post(
  "/collection-names",
  validateRequest(otherCollectionNameSchema),
  otherCollectionNameController.createcollectionName
);
route.get(
  "/collection-names",
  otherCollectionNameController.getAllcollectionName
);
route.put(
  "/collection-names/:id",
  otherCollectionNameController.updatecollectionName
);
route.delete(
  "/collection-names/:id",
  otherCollectionNameController.deletecollectionName
);

export const otherCollectionNameRoutes = route;
