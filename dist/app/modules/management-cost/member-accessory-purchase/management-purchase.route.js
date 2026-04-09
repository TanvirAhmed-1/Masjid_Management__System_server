"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.managementPurchaseRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const management_purchase_controller_1 = require("./management-purchase.controller");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const management_purchase_validation_1 = require("./management-purchase.validation");
const route = (0, express_1.Router)();
route.use((0, auth_middleware_1.auth)());
route.post("/accessory-purchases", (0, validateRequest_1.default)(management_purchase_validation_1.createMemberAccessoryPurchaseValidation), management_purchase_controller_1.managementPurchaseController.createPurchase);
route.get("/accessory-purchases", management_purchase_controller_1.managementPurchaseController.getAllPurchases);
route.get("/accessory-purchases/:id", management_purchase_controller_1.managementPurchaseController.getPurchaseById);
route.put("/accessory-purchases/:id", management_purchase_controller_1.managementPurchaseController.updatePurchase);
route.delete("/accessory-purchases/:id", management_purchase_controller_1.managementPurchaseController.deletePurchase);
exports.managementPurchaseRoutes = route;
