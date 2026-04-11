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
exports.auth = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const verifyToken_1 = __importDefault(require("../utils/verifyToken"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(http_status_1.default.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized user",
            });
        }
        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = (0, verifyToken_1.default)(token);
        }
        catch (_a) {
            return res.status(http_status_1.default.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized: Invalid or expired token",
            });
        }
        const user = yield prisma_1.default.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                mosqueId: true,
            },
        });
        if (!user) {
            return res.status(http_status_1.default.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }
        // ✅ mosque validation (FIXED)
        if (user.mosqueId) {
            const mosque = yield prisma_1.default.mosque.findUnique({
                where: { id: user.mosqueId },
                select: { id: true },
            });
            if (!mosque) {
                return res.status(http_status_1.default.UNAUTHORIZED).json({
                    success: false,
                    message: "Unauthorized: Mosque not found",
                });
            }
        }
        console.log("User Role:", user.mosqueId);
        // ✅ Role check
        if (requiredRoles.length &&
            !requiredRoles.includes(user.role)) {
            return res.status(http_status_1.default.FORBIDDEN).json({
                success: false,
                message: "Forbidden: insufficient role",
            });
        }
        // ✅ mosqueId added here
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            mosqueId: user.mosqueId,
        };
        next();
    }));
};
exports.auth = auth;
