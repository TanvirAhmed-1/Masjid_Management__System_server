"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const catchAsync = (func) => {
    return (req, res, next) => {
        Promise.resolve(func(req, res, next)).catch((err) => {
            // Handling user already exist
            if (err.message === "User already exist!") {
                res.status(http_status_1.default.BAD_REQUEST).json({
                    success: false,
                    message: err.message,
                    errorDetails: err,
                });
            }
            // Handling unauthorized user
            if (err.message === "Unauthorized Access") {
                res.status(http_status_1.default.UNAUTHORIZED).json({
                    success: false,
                    message: err.message,
                    errorDetails: err,
                });
            }
            // Handling user not found
            if (err.message === "User not found") {
                res.status(http_status_1.default.NOT_FOUND).json({
                    success: false,
                    message: err.message,
                    errorDetails: err,
                });
            }
            // Handling incorrect password
            if (err.message === "Incorrect password") {
                res.status(http_status_1.default.NOT_FOUND).json({
                    success: false,
                    message: err.message,
                    errorDetails: err,
                });
            }
            next(err);
        });
    };
};
exports.default = catchAsync;
