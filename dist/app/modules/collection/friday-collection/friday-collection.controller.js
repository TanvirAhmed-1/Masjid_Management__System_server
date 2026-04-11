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
exports.fridayCollectionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const friday_collection_services_1 = require("./friday-collection.services");
const createfridaycollection = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const payload = req.body;
    const userid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const mosqueId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.mosqueId;
    if (!mosqueId) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: "User or Mosque not found in token",
        });
    }
    const result = yield friday_collection_services_1.FridayCollectionServices.createFridayCollectionDB(Object.assign(Object.assign({}, payload), { userId: userid, mosqueId: mosqueId }));
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Friday Collection created successfully",
        data: result,
    });
}));
const getAllFridayCollection = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield friday_collection_services_1.FridayCollectionServices.getallcollectionDB(Object.assign(Object.assign({}, req.query), { mosqueId }));
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Friday Collection fetched successfully",
        data: result,
    });
}));
const updateFridayCollection = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const result = yield friday_collection_services_1.FridayCollectionServices.updateFridayCollectionDB(id, payload);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Friday Collection updated successfully",
        data: result,
    });
}));
const deleteFridayCollection = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield friday_collection_services_1.FridayCollectionServices.deleteFridayCollectionDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Friday Collection deleted successfully",
        data: result,
    });
}));
exports.fridayCollectionController = {
    createfridaycollection,
    getAllFridayCollection,
    updateFridayCollection,
    deleteFridayCollection,
};
