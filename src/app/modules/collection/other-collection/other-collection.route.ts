import { Router } from "express";
import { otherCollectionController } from "./other-collection.controller";
import validateRequest from "../../../middlewares/validateRequest";
import { otherCollectionValidationSchema } from "./other-collection.validation";
import { auth } from "../../../middlewares/auth.middleware";

const router = Router();

router.use(auth());

// -------------------- Collection Routes --------------------
// Create Collection
router.post(
  "/other-collection",
  validateRequest(otherCollectionValidationSchema),
  otherCollectionController.createCollection
);

// Get All Collections
router.get("/other-collection", otherCollectionController.getAllCollection);

// Get Collection By ID
router.get(
  "/other-collection/:id",
  otherCollectionController.getCollectionById
);

// Update Collection (only fields like date or name)
router.put("/other-collection/:id", otherCollectionController.updateCollection);

// Delete Collection
router.delete(
  "/other-collection/:id",
  otherCollectionController.deleteCollection
);

// -------------------- Donor Routes --------------------
// Update Donor
router.put(
  "/other-collection/donor/:donorId",
  otherCollectionController.updateDonor
);

// Delete Donor
router.delete(
  "/other-collection/donor/:donorId",
  otherCollectionController.deleteDonor
);

export const otherCollectionRoutes = router;
