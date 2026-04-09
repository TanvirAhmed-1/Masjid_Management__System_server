"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otherCollectionRoutes = void 0;
const express_1 = require("express");
const other_collection_controller_1 = require("./other-collection.controller");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const other_collection_validation_1 = require("./other-collection.validation");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use((0, auth_middleware_1.auth)());
// Create Collection
router.post("/other-collection", (0, validateRequest_1.default)(other_collection_validation_1.otherCollectionValidationSchema), other_collection_controller_1.otherCollectionController.createCollection);
// Get All Collections
router.get("/other-collection", other_collection_controller_1.otherCollectionController.getAllCollection);
// Get Collection By ID
router.get("/other-collection/:id", other_collection_controller_1.otherCollectionController.getCollectionById);
// Update Collection (only fields like date or name)
router.put("/other-collection/:id", other_collection_controller_1.otherCollectionController.updateCollection);
// Delete Collection
router.delete("/other-collection/:id", other_collection_controller_1.otherCollectionController.deleteCollection);
//  Donor Routes  section
router.post("/other-collection/donor", other_collection_controller_1.otherCollectionController.CreateDoner);
// Update Donor
router.put("/other-collection/donor/:donorId", other_collection_controller_1.otherCollectionController.updateDonor);
// Delete Donor
router.delete("/other-collection/donor/:donorId", other_collection_controller_1.otherCollectionController.deleteDonor);
exports.otherCollectionRoutes = router;
