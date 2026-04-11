"use strict";
// scripts/createSuperAdmin.ts
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
// npx ts-node src/scripts/createSuperAdmin.ts
// create a admin
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../app/utils/prisma"));
function main() {
  return __awaiter(this, void 0, void 0, function* () {
    const email = "tanvir1ahmed@example.com";
    const password = "Admin@123"; // strong password
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const existing = yield prisma_1.default.user.findUnique({
      where: { email },
    });
    if (existing) {
      console.log("SUPER_ADMIN already exists");
      return;
    }
    const superAdmin = yield prisma_1.default.user.create({
      data: {
        name: "Tanvir Ahmed",
        email,
        password: hashedPassword,
        role: "SUPER_ADMIN",
        address: "Head Office of Tanvir IT",
        gender: "MALE",
      },
    });
  });
}
main()
  .catch((e) => console.error(e))
  .finally(() => prisma_1.default.$disconnect());
