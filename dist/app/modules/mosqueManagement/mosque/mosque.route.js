"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mosqueRoutes = void 0;
const express_1 = require("express");
const mosque_controller_1 = require("./mosque.controller");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const mosque_validation_1 = require("./mosque.validation");
const router = (0, express_1.Router)();
router.use((0, auth_middleware_1.auth)());
router.get("/mosques", mosque_controller_1.mosqueController.getAllMosques);
router.post("/mosques", (0, validateRequest_1.default)(mosque_validation_1.createMosqueWithAdminSchema), mosque_controller_1.mosqueController.createmosque);
router.get("/mosques/:id", mosque_controller_1.mosqueController.getMosqueById);
router.put("/mosques/:id", mosque_controller_1.mosqueController.updateMosque);
router.delete("/mosques/:id", mosque_controller_1.mosqueController.deleteMosque);
exports.mosqueRoutes = router;
