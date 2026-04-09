"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otherCollectionNameRoutes = void 0;
const express_1 = require("express");
const otherCollectionName_controller_1 = require("./otherCollectionName.controller");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const otherCollectionName_validation_1 = require("./otherCollectionName.validation");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const route = (0, express_1.Router)();
route.use((0, auth_middleware_1.auth)());
route.post("/collection-names", (0, validateRequest_1.default)(otherCollectionName_validation_1.otherCollectionNameSchema), otherCollectionName_controller_1.otherCollectionNameController.createcollectionName);
route.get("/collection-names", otherCollectionName_controller_1.otherCollectionNameController.getAllcollectionName);
route.put("/collection-names/:id", otherCollectionName_controller_1.otherCollectionNameController.updatecollectionName);
route.delete("/collection-names/:id", otherCollectionName_controller_1.otherCollectionNameController.deletecollectionName);
exports.otherCollectionNameRoutes = route;
