"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequest_1.default)(user_validation_1.createUserSchema), user_controller_1.UserController.createdUser);
router.get("/users", user_controller_1.UserController.fetchUser);
router.post("/login", user_controller_1.UserController.loginUser);
router.delete("/users/:userId", user_controller_1.UserController.deleteUser);
router.put("/users/:userId", user_controller_1.UserController.updateUser);
router.post("/refresh-token", user_controller_1.UserController.generateAccessTokenFromRefresh);
exports.userRoute = router;
