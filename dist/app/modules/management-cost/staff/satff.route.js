"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffRoutes = void 0;
const satff_validation_1 = require("./satff.validation");
const express_1 = require("express");
const satff_controller_1 = require("./satff.controller");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const router = (0, express_1.Router)();
router.post("/staffs", (0, validateRequest_1.default)(satff_validation_1.createStaffSchema), satff_controller_1.satffController.createsatff);
router.get("/staffs", satff_controller_1.satffController.getAllstaff);
router.get("/staffs/:id", satff_controller_1.satffController.getstaffById);
router.put("/staffs/status/:id", satff_controller_1.satffController.updatestaffStatus);
router.put("/staffs/:id", satff_controller_1.satffController.updatestaff);
router.delete("/staffs/:id", satff_controller_1.satffController.deletestaff);
exports.staffRoutes = router;
