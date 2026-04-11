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
exports.mosqueServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createMosqueWithAdminDB = (payload, superAdminId) => __awaiter(void 0, void 0, void 0, function* () {
    const { mosque, admin } = payload;
    const hashedPassword = yield bcrypt_1.default.hash(admin.password, 12);
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        //  Create Mosque
        const createdMosque = yield tx.mosque.create({
            data: Object.assign(Object.assign({}, mosque), { createdBy: superAdminId }),
        });
        //  Create Admin User
        const createdAdmin = yield tx.user.create({
            data: {
                name: admin.name,
                email: admin.email,
                password: hashedPassword,
                address: admin.address,
                gender: admin.gender,
                phone: admin.phone,
                role: "ADMIN",
                mosqueId: createdMosque.id,
            },
        });
        return {
            mosque: createdMosque,
            admin: createdAdmin,
        };
    }));
});
const getAllMosquesDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.mosque.findMany({
        include: { users: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
    });
});
const getMosqueByIdDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.mosque.findUnique({ where: { id } });
    if (!isExist)
        throw new Error("Mosque not found");
    return yield prisma_1.default.mosque.findUnique({ where: { id } });
});
const updateMosqueDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.mosque.update({ where: { id }, data: payload });
});
const deleteMosqueDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.mosque.findUnique({ where: { id } });
    if (!isExist)
        throw new Error("Mosque not found");
    return yield prisma_1.default.mosque.delete({ where: { id } });
});
exports.mosqueServices = {
    createMosqueWithAdminDB,
    updateMosqueDB,
    deleteMosqueDB,
    getAllMosquesDB,
    getMosqueByIdDB,
};
