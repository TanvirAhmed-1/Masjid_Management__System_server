"use strict";
// src/shared/middlewares/cache.middleware.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheMiddleware = void 0;
const cache_util_1 = require("../utils/cache.util");
const cacheMiddleware = (keyPrefix) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const key = `${keyPrefix}:${req.originalUrl}`;
        try {
            const cachedData = yield (0, cache_util_1.getCache)(key);
            if (cachedData) {
                return res.status(200).json({
                    success: true,
                    data: cachedData,
                    fromCache: true,
                });
            }
            // Response intercepting logic...
            const originalSend = res.send;
            res.send = function (body) {
                (0, cache_util_1.setCache)(key, JSON.parse(body));
                return originalSend.call(this, body);
            };
            next();
        }
        catch (error) {
            console.error("Cache Error:", error);
            next();
        }
    });
};
exports.cacheMiddleware = cacheMiddleware;
