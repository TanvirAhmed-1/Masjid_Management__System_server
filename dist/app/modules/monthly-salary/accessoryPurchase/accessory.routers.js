"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessoryPurchaseRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const accessory_validation_1 = require("./accessory.validation");
const accessory_controller_1 = require("./accessory.controller");
const router = (0, express_1.Router)();
router.post("/accessory-purchases", (0, validateRequest_1.default)(accessory_validation_1.AccessoryPurchaseValidation.create), accessory_controller_1.accessoryPurchaseController.createPurchase);
router.get("/accessory-purchases", accessory_controller_1.accessoryPurchaseController.getAllPurchases);
router.get("/accessory-purchases/:id", accessory_controller_1.accessoryPurchaseController.getPurchaseById);
router.put("/accessory-purchases/:id", (0, validateRequest_1.default)(accessory_validation_1.AccessoryPurchaseValidation.update), accessory_controller_1.accessoryPurchaseController.updatePurchase);
router.delete("/accessory-purchases/:id", accessory_controller_1.accessoryPurchaseController.deletePurchase);
exports.accessoryPurchaseRoutes = router;
