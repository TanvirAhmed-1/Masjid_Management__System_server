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
// Create Member
const createMember = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const member = yield member_services_1.memberServices.createMemberDB(Object.assign(Object.assign({}, payload), { mosqueId }), userid);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Member created successfully",
        data: member,
    });
}));
// Get all Members
const getAllMembers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    const members = yield member_services_1.memberServices.getAllMembersDB(Object.assign({ mosqueId }, req.query));
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Members fetched successfully",
        data: members,
    });
}));
// Get Member by ID
const getMemberById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const member = yield member_services_1.memberServices.getMemberByIdDB(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Member fetched successfully",
        data: member,
    });
}));
// Update Member
const updateMember = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const updatedMember = yield member_services_1.memberServices.updateMemberDB(id, payload);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Member updated successfully",
        data: updatedMember,
    });
}));
// Delete Member
const deleteMember = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const mosqueId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.mosqueId;
    if (!mosqueId) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: "User or Mosque not found in token",
        });
    }
    const deletedMember = yield member_services_1.memberServices.deleteMemberDB(id, mosqueId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Member deleted successfully",
        data: deletedMember,
    });
}));
exports.memberController = {
    createMember,
    getAllMembers,
    getMemberById,
    updateMember,
    deleteMember,
};
