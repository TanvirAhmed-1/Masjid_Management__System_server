"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fridayCollectionRoutes = void 0;
const express_1 = require("express");
const friday_collection_controller_1 = require("./friday-collection.controller");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const friday_collection_validation_1 = require("./friday-collection.validation");
const route = (0, express_1.Router)();
route.use((0, auth_middleware_1.auth)());
route.post("/friday-collections", (0, validateRequest_1.default)(friday_collection_validation_1.fridayCollectionSchema), friday_collection_controller_1.fridayCollectionController.createfridaycollection);
route.get("/friday-collections", friday_collection_controller_1.fridayCollectionController.getAllFridayCollection);
route.put("/friday-collections/:id", friday_collection_controller_1.fridayCollectionController.updateFridayCollection);
route.delete("/friday-collections/:id", friday_collection_controller_1.fridayCollectionController.deleteFridayCollection);
exports.fridayCollectionRoutes = route;
