import { Router } from "express";
import { fridayCollectionController } from "./friday-collection.controller";
import { auth } from "../../../middlewares/auth.middleware";
import validateRequest from "../../../middlewares/validateRequest";
import { fridayCollectionSchema } from "./friday-collection.validation";

const route = Router();
route.use(auth());
route.post(
  "/friday-collections ",
  validateRequest(fridayCollectionSchema),
  fridayCollectionController.createfridaycollection
);
route.get(
  "/friday-collections ",
  fridayCollectionController.getAllFridayCollection
);
route.put(
  "/friday-collections/:id",
  fridayCollectionController.updateFridayCollection
);
route.delete(
  "/friday-collections/:id",
  fridayCollectionController.deleteFridayCollection
);

export const fridayCollectionRoutes = route;
