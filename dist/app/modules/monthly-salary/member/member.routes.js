"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberRoutes = void 0;
const express_1 = require("express");
const member_validation_1 = require("./member.validation");
const member_controller_1 = require("./member.controller");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const router = (0, express_1.Router)();
router.post("/members", (0, validateRequest_1.default)(member_validation_1.MemberValidation.create), member_controller_1.memberController.createMember);
router.get("/members", member_controller_1.memberController.getMembers);
router.get("/members/:id", member_controller_1.memberController.getMemberById);
router.put("/members/:id", member_controller_1.memberController.updateMember);
router.delete("/members/:id", member_controller_1.memberController.deleteMember);
exports.memberRoutes = router;
