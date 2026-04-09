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
exports.itikaController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const itikaf_servicess_1 = require("./itikaf.servicess");
const createItika = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const data = req.body;
    const mosqueId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.mosqueId;
    if (!mosqueId) {
        throw new Error("Mosque        ID is required");
    }
    if (!userId) {
        throw new Error("User ID is required");
    }
    const payload = Object.assign(Object.assign({}, data), { userId, mosqueId });
    const result = yield itikaf_servicess_1.itikaServices.createItikaDB(payload);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Itika record created successfully",
        result,
    });
}));
const getAllItika = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    if (!mosqueId) {
        throw new Error("Mosque ID is required");
    }
    const result = yield itikaf_servicess_1.itikaServices.getAllItikaDB(Object.assign({ mosqueId }, req.query));
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Itika records fetched successfully",
        result,
    });
}));
const getSingleItika = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ramadanId } = req.params;
    const result = yield itikaf_servicess_1.itikaServices.getSingleItikaDB(ramadanId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Itika record fetched successfully",
        result,
    });
}));
const updateItika = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield itikaf_servicess_1.itikaServices.updateItikaDB(id, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Itika record updated successfully",
        result,
    });
}));
const deleteItika = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield itikaf_servicess_1.itikaServices.deleteItikaDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Itika record deleted successfully",
        result,
    });
}));
exports.itikaController = {
    createItika,
    getAllItika,
    getSingleItika,
    updateItika,
    deleteItika,
};
