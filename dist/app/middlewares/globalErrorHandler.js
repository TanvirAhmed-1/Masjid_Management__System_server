"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const globalErrorHandler = (err, req, res, next) => {
    var _a, _b;
    console.error(" Global Error:", err);
    let statusCode = 500;
    let message = "Something went wrong";
    // Handle Prisma unique constraint error safely
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        statusCode = http_status_1.default.CONFLICT;
        const target = ((_a = err.meta) === null || _a === void 0 ? void 0 : _a.target) || ((_b = err.meta) === null || _b === void 0 ? void 0 : _b.targetFields);
        let fieldNames;
        if (Array.isArray(target)) {
            fieldNames = target.join(", ");
        }
        else if (typeof target === "string") {
            fieldNames = target;
        }
        else {
            fieldNames = "unknown field";
        }
        message = `Duplicate field value for: ${fieldNames}`;
    }
    //  Handle Zod validation errors
    else if (err instanceof zod_1.ZodError) {
        statusCode = http_status_1.default.BAD_REQUEST;
        message = err.issues.map((issue) => issue.message).join(", ");
    }
    //  Other JS errors
    else if (err instanceof Error) {
        message = err.message;
    }
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
exports.default = globalErrorHandler;
// import { Request, Response, NextFunction } from "express";
// import httpStatus from "http-status";
// import { Prisma } from "@prisma/client";
// import { ZodError } from "zod";
// const globalErrorHandler = (
//   err: any,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.error("Global Error:", err);
//   // ✅ IMPORTANT: number type (not 500 literal)
//   let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
//   let message = "Something went wrong";
//   /**
//    * ✅ Prisma Unique Constraint Error (P2002)
//    * Using safe property checks (NO instanceof)
//    */
//   if (
//     err?.code === "P2002" &&
//     err?.name === "PrismaClientKnownRequestError"
//   ) {
//     statusCode = httpStatus.CONFLICT;
//     const target = err?.meta?.target || err?.meta?.targetFields;
//     let fieldNames = "unknown field";
//     if (Array.isArray(target)) {
//       fieldNames = target.join(", ");
//     } else if (typeof target === "string") {
//       fieldNames = target;
//     }
//     message = `Duplicate field value for: ${fieldNames}`;
//   }
//   /**
//    * ✅ Zod Validation Error
//    */
//   else if (err instanceof ZodError) {
//     statusCode = httpStatus.BAD_REQUEST;
//     message = err.issues.map(issue => issue.message).join(", ");
//   }
//   /**
//    * ✅ Other JS / App Errors
//    */
//   else if (err instanceof Error) {
//     message = err.message;
//   }
//   return res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message,
//     stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
//   });
// };
// export default globalErrorHandler;
