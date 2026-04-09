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
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const mosque_services_1 = require("./mosque.services");
const createmosque = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = req.body;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id))
        throw new Error("Unauthorized");
    const superAdminId = req.user.id;
    const result = yield mosque_services_1.mosqueServices.createMosqueWithAdminDB(payload, superAdminId);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Mosque and Admin created successfully",
        data: result,
    });
}));
const getAllMosques = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield mosque_services_1.mosqueServices.getAllMosquesDB();
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Mosques fetched successfully",
        data: result,
    });
}));
const getMosqueById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield mosque_services_1.mosqueServices.getMosqueByIdDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Mosque fetched successfully",
        data: result,
    });
}));
const updateMosque = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const result = yield mosque_services_1.mosqueServices.updateMosqueDB(id, payload);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Mosque updated successfully",
        data: result,
    });
}));
const deleteMosque = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield mosque_services_1.mosqueServices.deleteMosqueDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Mosque deleted successfully",
        data: result,
    });
}));
exports.mosqueController = {
    createmosque,
    getAllMosques,
    getMosqueById,
    updateMosque,
    deleteMosque,
};
