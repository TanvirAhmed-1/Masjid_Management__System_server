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
exports.ifterlistcontroller = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const ifterlist_services_1 = require("./ifterlist.services");
const createifterlist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const mosqueId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.mosqueId;
    if (!mosqueId)
        throw new Error("Mosque ID is required");
    if (!userId)
        throw new Error("User not authenticated");
    const payload = Object.assign({ userId,
        mosqueId }, req.body);
    const result = yield ifterlist_services_1.ifterlistServices.createlistDB(payload);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Iftar list created successfully",
        result,
    });
}));
const getifterlist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield ifterlist_services_1.ifterlistServices.getifterlistDB(Object.assign({ mosqueId }, req.query));
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Iftar list records fetched successfully",
        result,
    });
}));
const getsingleifterlist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield ifterlist_services_1.ifterlistServices.getIftarListByRamadanYearDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Iftar lists fetched by Ramadan year successfully",
        result,
    });
}));
const updateifterlist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    const result = yield ifterlist_services_1.ifterlistServices.updateifterlistDB(id, data);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Iftar list record updated successfully",
        result,
    });
}));
const deleteifterlist = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield ifterlist_services_1.ifterlistServices.deleteifterlistDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Iftar list record deleted successfully",
        result,
    });
}));
const deleteifterdoner = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield ifterlist_services_1.ifterlistServices.deleteifterdonerDD(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Iftar list Doner deleted successfully",
        result,
    });
}));
exports.ifterlistcontroller = {
    createifterlist,
    getifterlist,
    getsingleifterlist,
    updateifterlist,
    deleteifterlist,
    deleteifterdoner,
};
