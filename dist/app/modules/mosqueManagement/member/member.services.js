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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// MEMBER create
const createMemberDB = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = payload, rest = __rest(payload, ["password"]);
    // password hash
    const hashedPassword = yield bcrypt_1.default.hash(password, 12);
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const createdMember = yield tx.user.create({
            data: Object.assign(Object.assign({}, rest), { password: hashedPassword, role: "MEMBER", mosqueId: payload.mosqueId }),
        });
        return createdMember;
    }));
});
const getAllMembersDB = (_a) => __awaiter(void 0, [_a], void 0, function* ({ mosqueId, name, email, phone }) {
    return yield prisma_1.default.user.findMany({
        where: Object.assign(Object.assign(Object.assign(Object.assign({ role: "MEMBER" }, (mosqueId && { mosqueId })), (name && { name: { contains: name, mode: "insensitive" } })), (email && { email: { contains: email, mode: "insensitive" } })), (phone && { phone: { contains: phone } })),
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            gender: true,
            createdAt: true,
            mosque: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
});
// Get MEMBER by ID
const getMemberByIdDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const idExist = yield prisma_1.default.user.findUnique({ where: { id } });
    if (!idExist)
        throw new Error("Member not found");
    const member = yield prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            gender: true,
            mosqueId: true,
            createdAt: true,
        },
    });
    if (!member)
        throw new Error("Member not found");
    return member;
});
// Update MEMBER
const updateMemberDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // if password exists, hash it
    if (payload.password) {
        payload.password = yield bcrypt_1.default.hash(payload.password, 12);
    }
    return yield prisma_1.default.user.update({
        where: { id },
        data: payload,
    });
});
// Delete MEMBER
const deleteMemberDB = (id, mosqueId) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield prisma_1.default.user.findUnique({ where: { id } });
    if (!exists)
        throw new Error("Member not found");
    if (mosqueId && exists.mosqueId !== mosqueId) {
        throw new Error("Member does not belong to this mosque");
    }
    return yield prisma_1.default.user.delete({ where: { id } });
});
// Export services
exports.memberServices = {
    createMemberDB,
    getAllMembersDB,
    getMemberByIdDB,
    updateMemberDB,
    deleteMemberDB,
};
