"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Route ${req.originalUrl} not found`,
    });
};
exports.default = notFoundHandler;
