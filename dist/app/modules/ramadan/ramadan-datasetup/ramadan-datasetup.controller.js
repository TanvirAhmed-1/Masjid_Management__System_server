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
exports.ramadandatacontroller = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const ramadan_datasetup_servisess_1 = require("./ramadan-datasetup.servisess");
const createdRamadanDatasetUp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user.id;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    if (!mosqueId)
        throw new Error("Mosque ID is required");
    if (!userId)
        throw new Error("User not authenticated");
    const data = req.body;
    const payload = Object.assign(Object.assign({}, data), { userId,
        mosqueId });
    const result = yield ramadan_datasetup_servisess_1.dateSetUpServicess.createrRamadanDataSetupDB(payload);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Ramadan Data SetUp  create successfully",
        result,
    });
}));
const getRamadanDatasetUp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield ramadan_datasetup_servisess_1.dateSetUpServicess.fetchRamadanDataDB(Object.assign({ mosqueId }, req.query));
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Data feaching successfully",
        result,
    });
}));
const updateRamadanDatasetUp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ramadanyearId } = req.params;
    const result = yield ramadan_datasetup_servisess_1.dateSetUpServicess.updateRamadanDataSetupBD(ramadanyearId, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Data Update successfully",
        result,
    });
}));
const deleteRamadanDatasetUp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ramadanyearId } = req.params;
    const result = yield ramadan_datasetup_servisess_1.dateSetUpServicess.deleteRamadanDataSetupBD(ramadanyearId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "User deleted successfully",
        result,
    });
}));
exports.ramadandatacontroller = {
    createdRamadanDatasetUp,
    getRamadanDatasetUp,
    updateRamadanDatasetUp,
    deleteRamadanDatasetUp,
};
