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
exports.otherCollectionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const other_collection_services_1 = require("./other-collection.services");
const createCollection = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    if (!mosqueId)
        throw new Error("Mosque ID is required");
    if (!((_b = req.user) === null || _b === void 0 ? void 0 : _b.id))
        throw new Error("User not authenticated");
    const data = req.body;
    const payload = Object.assign(Object.assign({}, data), { userId: req.user.id, mosqueId });
    const result = yield other_collection_services_1.otherCollectionService.createCollectionDB(payload);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Collection created successfully",
        result,
    });
}));
const deleteDonor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { donorId } = req.params;
    if (!donorId)
        throw new Error("Donor ID is required");
    const result = yield other_collection_services_1.otherCollectionService.deleteDonorDB(donorId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Donor deleted successfully",
        result,
    });
}));
// -------------------- Update Donor --------------------
const updateDonor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { donorId } = req.params;
    if (!donorId)
        throw new Error("Donor ID is required");
    const { name, amount } = req.body;
    const result = yield other_collection_services_1.otherCollectionService.updateDonorDB(donorId, {
        name,
        amount,
    });
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Donor updated successfully",
        result,
    });
}));
const getAllCollection = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield other_collection_services_1.otherCollectionService.getAllCollectionsDB(Object.assign(Object.assign({}, req.query), { mosqueId }));
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Collections fetched successfully",
        data: result,
    });
}));
const updateCollection = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        throw new Error("Collection ID is required");
    const { donors } = req.body;
    const result = yield other_collection_services_1.otherCollectionService.updateColeectionDB(id, donors);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Collection updated successfully",
        result,
    });
}));
const CreateDoner = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collectionId, name, amount } = req.body;
    const result = yield other_collection_services_1.otherCollectionService.createDonerDB({
        collectionId,
        name,
        amount,
    });
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Donor created successfully",
        result,
    });
}));
// -------------------- Get Collection By ID --------------------
const getCollectionById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield other_collection_services_1.otherCollectionService.getCollectionByIdDB(Object.assign({ id,
        mosqueId }, req.query));
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Collection fetched successfully",
        result,
    });
}));
// -------------------- Delete Collection --------------------
const deleteCollection = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield other_collection_services_1.otherCollectionService.deleteCollectionDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Collection deleted successfully",
        result,
    });
}));
exports.otherCollectionController = {
    createCollection,
    getAllCollection,
    getCollectionById,
    deleteCollection,
    deleteDonor,
    updateDonor,
    updateCollection,
    CreateDoner,
};
