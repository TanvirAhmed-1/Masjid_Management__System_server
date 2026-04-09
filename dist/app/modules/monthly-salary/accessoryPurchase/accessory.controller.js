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
exports.accessoryPurchaseController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const accessory_services_1 = require("./accessory.services");
const createPurchase = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user.id;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const payload = Object.assign(Object.assign({}, req.body), { userId, mosqueId });
    const result = yield accessory_services_1.accessoryPurchaseServices.createPurchaseDB(payload);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        statusCode: 201,
        message: "Accessory purchase recorded successfully",
        result,
    });
}));
const getAllPurchases = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield accessory_services_1.accessoryPurchaseServices.getAllPurchasesDB(Object.assign({ mosqueId }, req.query));
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: 200,
        message: "Purchases fetched successfully",
        result,
    });
}));
const getPurchaseById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield accessory_services_1.accessoryPurchaseServices.getPurchaseByIdDB(req.params.id);
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: 200,
        message: "Purchase details fetched successfully",
        result,
    });
}));
const updatePurchase = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield accessory_services_1.accessoryPurchaseServices.updatePurchaseDB(req.params.id, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Purchase updated successfully",
        data: result,
    });
}));
const deletePurchase = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield accessory_services_1.accessoryPurchaseServices.deletePurchaseDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: 200,
        message: "Purchase record deleted successfully",
        result,
    });
}));
exports.accessoryPurchaseController = {
    createPurchase,
    getAllPurchases,
    getPurchaseById,
    updatePurchase,
    deletePurchase,
};
