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
exports.satffController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const satff_services_1 = require("./satff.services");
const createsatff = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const data = req.body;
    const userid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const mosqueId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.mosqueId;
    if (!mosqueId) {
        throw new Error("Mosque ID is required");
    }
    const payload = Object.assign(Object.assign({}, data), { userId: userid, mosqueId });
    const result = yield satff_services_1.staffServices.createstffDB(payload);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "staff created successfully",
        result,
    });
}));
const getAllstaff = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield satff_services_1.staffServices.getAllstaffDB(Object.assign({ mosqueId }, req.query));
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "staff fetched successfully",
        result,
    });
}));
const getstaffById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield satff_services_1.staffServices.getstaffByIdDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "staff fetched successfully",
        result,
    });
}));
const updatestaff = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const data = req.body;
    const result = yield satff_services_1.staffServices.updatestaffDB(id, data, mosqueId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "staff updated successfully",
        result,
    });
}));
const updatestaffStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const { status } = req.body;
    if (typeof status !== "boolean") {
        throw new Error("Status must be boolean");
    }
    const data = status;
    const result = yield satff_services_1.staffServices.updatestaffStatusDB(id, data, mosqueId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "staff updated successfully",
        result,
    });
}));
const deletestaff = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield satff_services_1.staffServices.deletestaffDB(id, mosqueId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "staff deleted successfully",
        result,
    });
}));
exports.satffController = {
    createsatff,
    getAllstaff,
    getstaffById,
    updatestaff,
    deletestaff,
    updatestaffStatus,
};
