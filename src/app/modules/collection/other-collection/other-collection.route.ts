import { Router } from "express";
import { otherCollectionController } from "./other-collection.controller";
import validateRequest from "../../../middlewares/validateRequest";
import { otherCollectionValidationSchema } from "./other-collection.validation";

const router = Router();

// Create
router.post(
  "/other-collection",
  validateRequest(otherCollectionValidationSchema),
  otherCollectionController.createCollection
);

// Get All
router.get("/other-collection", otherCollectionController.getAllCollection);

// Update
router.put("/other-collection/:id", otherCollectionController.updateCollection);

// Delete
router.delete(
  "/other-collection/:id",
  otherCollectionController.deleteCollection
);

export const otherCollectionRoutes = router;
