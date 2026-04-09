"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mosquememberRoutes = void 0;
const express_1 = require("express");
const member_controller_1 = require("./member.controller");
const member_validation_1 = require("./member.validation");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use((0, auth_middleware_1.auth)());
router.post("/mosque/members", (0, validateRequest_1.default)(member_validation_1.createMemberValidationSchema), member_controller_1.memberController.createMember);
router.get("/mosque/members", member_controller_1.memberController.getAllMembers);
router.get("/mosque/members/:id", member_controller_1.memberController.getMemberById);
router.put("/mosque/members/:id", member_controller_1.memberController.updateMember);
router.delete("/mosque/members/:id", member_controller_1.memberController.deleteMember);
exports.mosquememberRoutes = router;
