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
const prisma_1 = __importDefault(require("../../utils/prisma"));
const getmosqueDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const mosque = yield prisma_1.default.mosque.findUnique({
        where: { id },
    });
    if (!mosque)
        throw new Error("Mosque not found");
    return mosque;
});
const updateMosqueDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.mosque.findUnique({
        where: { id },
    });
    if (!existing) {
        throw new Error("Mosque not found");
    }
    const mosque = yield prisma_1.default.mosque.update({
        where: { id },
        data: {
            name: data.name,
            address: data.address,
        },
    });
    return mosque;
});
exports.mosqueServices = {
    getmosqueDB,
    updateMosqueDB,
};
