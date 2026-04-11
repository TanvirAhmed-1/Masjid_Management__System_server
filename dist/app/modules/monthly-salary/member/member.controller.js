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
exports.memberController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const member_services_1 = require("./member.services");
const createMember = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user.id;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const payload = Object.assign(Object.assign({}, req.body), { userId, mosqueId });
    const result = yield member_services_1.memberServices.createMemberDB(payload);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        statusCode: 201,
        message: "Member created successfully",
        result,
    });
}));
const getMembers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const result = yield member_services_1.memberServices.getAllMembersDB(Object.assign({ mosqueId }, req.query));
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: 200,
        message: "Members fetched successfully",
        result,
    });
}));
const getMemberById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield member_services_1.memberServices.getMemberByIdDB(req.params.id);
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: 200,
        message: "Member fetched successfully",
        result,
    });
}));
const updateMember = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield member_services_1.memberServices.updateMenberDB(req.params.id, req.body);
    if (!result) {
        return res.status(http_status_1.default.NOT_FOUND).json({
            success: false,
            message: "Member not found",
        });
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Member updated successfully",
        data: result,
    });
}));
const deleteMember = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield member_services_1.memberServices.deleteMemberDB(req.params.id);
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: 200,
        message: "Member deleted successfully",
        result,
    });
}));
exports.memberController = {
    createMember,
    getMembers,
    getMemberById,
    updateMember,
    deleteMember,
};
