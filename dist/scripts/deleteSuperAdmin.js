"use strict";
// scripts/deleteSuperAdmin.ts
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
const prisma_1 = __importDefault(require("../app/utils/prisma"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const email = "tanvir1ahmed@example.com"; // আগের SUPER_ADMIN এর email
        const existing = yield prisma_1.default.user.findUnique({ where: { email } });
        if (!existing) {
            console.log("SUPER_ADMIN not found");
            return;
        }
        yield prisma_1.default.user.delete({ where: { email } });
        console.log("SUPER_ADMIN deleted successfully");
    });
}
main()
    .catch((e) => console.error(e))
    .finally(() => prisma_1.default.$disconnect());
