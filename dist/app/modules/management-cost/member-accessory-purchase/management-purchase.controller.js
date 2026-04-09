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
exports.managementPurchaseController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const management_purchase_services_1 = require("./management-purchase.services");
const createPurchase = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = req.body;
    const userid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const payload = Object.assign(Object.assign({}, data), { userId: userid });
    const result = yield management_purchase_services_1.MemberAccessoryPurchaseService.createPurchaseDB(payload);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Purchase created successfully",
        result,
    });
}));
const getAllPurchases = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield management_purchase_services_1.MemberAccessoryPurchaseService.fetchAllPurchasesDB();
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Purchases fetched successfully",
        result,
    });
}));
const getPurchaseById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield management_purchase_services_1.MemberAccessoryPurchaseService.fetchPurchaseByIdDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Purchase fetched successfully",
        result,
    });
}));
const updatePurchase = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    const result = yield management_purchase_services_1.MemberAccessoryPurchaseService.updatePurchaseDB(id, data);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Purchase updated successfully",
        result,
    });
}));
const deletePurchase = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield management_purchase_services_1.MemberAccessoryPurchaseService.deletePurchaseDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Purchase deleted successfully",
        result,
    });
}));
exports.managementPurchaseController = {
    createPurchase,
    getAllPurchases,
    getPurchaseById,
    updatePurchase,
    deletePurchase,
};
