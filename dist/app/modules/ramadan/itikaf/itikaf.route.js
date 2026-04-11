"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itikaRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const itikaf_validation_1 = require("./itikaf.validation");
const itikaf_controller_1 = require("./itikaf.controller");
const router = (0, express_1.Router)();
router.use((0, auth_middleware_1.auth)());
router.post("/itikafs", (0, auth_middleware_1.auth)(), (0, validateRequest_1.default)(itikaf_validation_1.itikafSchema), itikaf_controller_1.itikaController.createItika);
router.get("/itikafs", itikaf_controller_1.itikaController.getAllItika);
router.get("/itikafs/:ramadanId", itikaf_controller_1.itikaController.getSingleItika);
router.put("/itikafs/:id", (0, auth_middleware_1.auth)(), itikaf_controller_1.itikaController.updateItika);
router.delete("/itikafs/:id", (0, auth_middleware_1.auth)(), itikaf_controller_1.itikaController.deleteItika);
exports.itikaRoutes = router;
