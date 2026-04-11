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
exports.mosqueController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const mosque_services_1 = require("./mosque.services");
const cache_util_1 = require("../../utils/cache.util");
const getMosque = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield mosque_services_1.mosqueServices.getmosqueDB(mosqueId);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Mosque get successfully",
        result,
    });
}));
const updateMosque = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const data = req.body;
    const result = yield mosque_services_1.mosqueServices.updateMosqueDB(mosqueId, data);
    const cacheKey = `mosque:/get-mosque`;
    yield (0, cache_util_1.deleteCache)(cacheKey);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Mosque updated successfully",
        result,
    });
}));
exports.mosqueController = {
    getMosque,
    updateMosque,
};
