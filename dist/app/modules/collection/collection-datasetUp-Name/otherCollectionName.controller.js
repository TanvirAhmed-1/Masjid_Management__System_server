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
exports.otherCollectionNameController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const otherCollectionName_services_1 = require("./otherCollectionName.services");
const createcollectionName = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const payload = req.body;
    const userid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const mosqueId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.mosqueId;
    const data = Object.assign(Object.assign({}, payload), { userId: userid, mosqueId: mosqueId });
    const result = yield otherCollectionName_services_1.OtherCollectionNameServices.createcollectionName(data);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Other Collection Name created successfully",
        data: result,
    });
}));
const getAllcollectionName = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield otherCollectionName_services_1.OtherCollectionNameServices.getAllCollectionName(Object.assign(Object.assign({}, req.query), { mosqueId: mosqueId }));
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Other Collection Name fetched successfully",
        data: result,
    });
}));
const updatecollectionName = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const result = yield otherCollectionName_services_1.OtherCollectionNameServices.updatecollectionName(id, payload);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Other Collection Name updated successfully",
        data: result,
    });
}));
const deletecollectionName = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield otherCollectionName_services_1.OtherCollectionNameServices.deletecollectionName(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Other Collection Name deleted successfully",
        data: result,
    });
}));
exports.otherCollectionNameController = {
    createcollectionName,
    getAllcollectionName,
    updatecollectionName,
    deletecollectionName,
};
