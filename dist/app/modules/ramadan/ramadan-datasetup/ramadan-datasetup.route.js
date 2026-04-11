"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ramadanDataSetUpRoute = void 0;
const auth_middleware_1 = require("./../../../middlewares/auth.middleware");
const express_1 = require("express");
const ramadan_datasetup_controller_1 = require("./ramadan-datasetup.controller");
const ramadan_datasetup_validation_1 = require("./ramadan-datasetup.validation");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const router = (0, express_1.Router)();
router.use((0, auth_middleware_1.auth)());
router.post("/ramadan-data-setups", (0, validateRequest_1.default)(ramadan_datasetup_validation_1.ramadandatasetupSchema), ramadan_datasetup_controller_1.ramadandatacontroller.createdRamadanDatasetUp);
router.get("/ramadan-data-setups", ramadan_datasetup_controller_1.ramadandatacontroller.getRamadanDatasetUp);
router.delete("/ramadan-data-setups/:ramadanyearId", ramadan_datasetup_controller_1.ramadandatacontroller.deleteRamadanDatasetUp);
router.put("/ramadan-data-setups/:ramadanyearId", ramadan_datasetup_controller_1.ramadandatacontroller.updateRamadanDatasetUp);
exports.ramadanDataSetUpRoute = router;
