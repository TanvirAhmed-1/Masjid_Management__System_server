"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const user_services_1 = require("./user.services");
// Create User
const createdUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.userServices.createUserDB(req.body);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        statusCode: 201,
        message: "User created successfully",
        result,
    });
}));
// Fetch All Users
const fetchUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Token received:", req.headers.authorization);
    const result = yield user_services_1.userServices.getUserDB();
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: 200,
        message: "User fetched successfully",
        result,
    });
}));
// Update User
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield user_services_1.userServices.updateProfileDB(userId, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "User updated successfully",
        result,
    });
}));
// Delete User
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield user_services_1.userServices.deleteUserDB(userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "User deleted successfully",
        result,
    });
}));
// Login User
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Login request body:", req.body);
    // Validate input using Zod
    const { email, password } = req.body;
    // Login service
    const result = yield user_services_1.userServices.loginUser(email, password);
    // Set refreshToken in cookie
    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // prod = true
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // Send response
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "User logged in successfully",
        result,
    });
}));
const generateAccessTokenFromRefresh = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield user_services_1.userServices.generateAccessTokenFromRefresh((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken);
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: 201,
        message: "Token generated successfully",
        result,
    });
}));
exports.UserController = {
    createdUser,
    fetchUser,
    updateUser,
    deleteUser,
    loginUser,
    generateAccessTokenFromRefresh
};
