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
exports.userServices = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createUserDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 10);
    const existingEmail = yield prisma_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (existingEmail) {
        throw new Error("Email already exists!");
    }
    return yield prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, payload), { password: hashedPassword }),
    });
});
const getUserDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.findMany();
});
const updateProfileDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!existing) {
        throw new Error("User ID not valid!");
    }
    return yield prisma_1.default.user.update({
        where: { id: userId },
        data: payload,
    });
});
const deleteUserDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.delete({
        where: { id: userId },
    });
});
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const user = yield prisma_1.default.user.findUnique({
        where: { email },
        include: {
            mosque: {
                select: { id: true, name: true },
            },
        },
    });
    if (!user) {
        throw new Error("User email not found!");
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password!");
    }
    const jwtPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        mosqueId: (_a = user.mosque) === null || _a === void 0 ? void 0 : _a.id,
    };
    //  Check for environment variables
    if (!process.env.TOKEN_SECRET_KEY || !process.env.REFRESHTOKEN_SECRET_KEY) {
        throw new Error("JWT secret keys are missing in environment variables");
    }
    //  Access Token
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, process.env.TOKEN_SECRET_KEY, {
        expiresIn: "7d",
    });
    //  Refresh Token
    const refreshToken = jsonwebtoken_1.default.sign(jwtPayload, process.env.REFRESHTOKEN_SECRET_KEY, { expiresIn: "30d" });
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        mosqueId: (_b = user.mosque) === null || _b === void 0 ? void 0 : _b.id,
        mosqueName: (_c = user.mosque) === null || _c === void 0 ? void 0 : _c.name,
        accessToken,
        refreshToken,
    };
});
const generateAccessTokenFromRefresh = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken) {
        throw new Error("Refresh token missing");
    }
    try {
        // Verify refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESHTOKEN_SECRET_KEY);
        //checking if the token has expired
        if (decoded.exp) {
            const timeNow = Math.round(Date.now() / 1000);
            if (decoded.exp < timeNow) {
                throw new Error("Refresh token expired. Please login again!");
            }
        }
        // Create new access token
        const newAccessToken = jsonwebtoken_1.default.sign({
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
            mosqueId: decoded.mosqueId,
        }, process.env.TOKEN_SECRET_KEY, { expiresIn: "7d" });
        return { token: newAccessToken };
    }
    catch (err) {
        throw new Error("Invalid or expired refresh token");
    }
});
exports.userServices = {
    createUserDB,
    getUserDB,
    updateProfileDB,
    deleteUserDB,
    loginUser,
    generateAccessTokenFromRefresh,
};
