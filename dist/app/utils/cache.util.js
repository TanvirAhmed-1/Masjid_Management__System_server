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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCache = exports.getCache = exports.setCache = exports.connectRedis = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: "redis://localhost:6379",
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!redisClient.isOpen)
        yield redisClient.connect();
});
exports.connectRedis = connectRedis;
const setCache = (key_1, value_1, ...args_1) => __awaiter(void 0, [key_1, value_1, ...args_1], void 0, function* (key, value, ttl = 3600) {
    yield redisClient.set(key, JSON.stringify(value), { EX: ttl });
});
exports.setCache = setCache;
const getCache = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield redisClient.get(key);
    return data ? JSON.parse(data) : null;
});
exports.getCache = getCache;
const deleteCache = (key) => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.del(key);
});
exports.deleteCache = deleteCache;
