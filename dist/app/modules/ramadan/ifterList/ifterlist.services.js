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
exports.ifterlistServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const createlistDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { ramadanyearId, doners, userId } = payload, data = __rest(payload, ["ramadanyearId", "doners", "userId"]);
    // Find existing IfterList for this Ramadan year
    const existing = yield prisma_1.default.ifterList.findFirst({
        where: { ramadanyearId },
        include: { doners: true },
    });
    if (existing) {
        // Simply add all donors to the existing list
        yield prisma_1.default.doner.createMany({
            data: doners.map((d) => ({
                serialNumber: d.serialNumber,
                name: d.name,
                iftarDate: new Date(d.iftarDate),
                dayName: d.dayName,
                ifterListId: existing.id,
            })),
        });
        // Return the updated list
        return prisma_1.default.ifterList.findUnique({
            where: { id: existing.id },
            include: { doners: true },
        });
    }
    // If no existing list, create a new IfterList with donors
    const newList = yield prisma_1.default.ifterList.create({
        data: Object.assign(Object.assign({ ramadanyearId,
            userId }, data), { doners: {
                create: doners.map((d) => ({
                    serialNumber: d.serialNumber,
                    name: d.name,
                    iftarDate: new Date(d.iftarDate),
                    dayName: d.dayName,
                })),
            } }),
        include: { doners: true },
    });
    return newList;
});
// const getifterlistDB = async (query: any) => {
//   const {
//     mosqueId,
//     limit = 20,
//     page = 1,
//     sortBy = "createdAt",
//     sortOrder = "desc",
//     ramadanYear,
//     date,
//     name,
//   } = query;
//   if (!mosqueId) {
//     throw new Error("Mosque ID is required");
//   }
//   const skip = (Number(page) - 1) * Number(limit);
//   const take = Number(limit);
//   const whereCondition: any = { mosqueId };
//   if (ramadanYear) {
//     whereCondition.ramadanyearId = ramadanYear;
//   }
//   // 🟢 merge doners filter safely
//   if (date || name) {
//     whereCondition.doners = {
//       some: {},
//     };
//     if (date) {
//       whereCondition.doners.some.iftarDate = new Date(date);
//     }
//     if (name) {
//       whereCondition.doners.some.name = {
//         contains: name,
//         mode: "insensitive",
//       };
//     }
//   }
//   const total = await prisma.ifterList.count({
//     where: whereCondition,
//   });
//   const result = await prisma.ifterList.findMany({
//     where: whereCondition,
//     skip,
//     take,
//     orderBy: {
//       [sortBy]: sortOrder,
//     },
//     include: {
//       doners: {
//         orderBy: {
//           serialNumber: "desc",
//         },
//       },
//       mosque: {
//         select: {
//           name: true,
//         },
//       },
//       ramadanyear: {
//         select: {
//           id: true,
//           ramadanYear: true,
//           titleName: true,
//         },
//       },
//     },
//   });
//   return {
//     meta: {
//       page: Number(page),
//       limit: Number(limit),
//       total,
//       totalPage: Math.ceil(total / Number(limit)),
//     },
//     data: result,
//   };
// };
const getifterlistDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { mosqueId, limit = 20, page = 1, sortBy = "createdAt", sortOrder = "desc", ramadanYear, date, name, } = query;
    if (!mosqueId) {
        throw new Error("Mosque ID is required");
    }
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const whereCondition = { mosqueId };
    if (ramadanYear) {
        whereCondition.ramadanyear = {
            ramadanYear: ramadanYear.toString(),
        };
    }
    if (date || name) {
        const donorFilter = {};
        if (date) {
            donorFilter.iftarDate = new Date(date);
        }
        if (name) {
            donorFilter.name = {
                contains: name,
                mode: "insensitive",
            };
        }
        whereCondition.doners = {
            some: donorFilter,
        };
    }
    const total = yield prisma_1.default.ifterList.count({
        where: whereCondition,
    });
    const result = yield prisma_1.default.ifterList.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            doners: {
                where: date || name ? Object.assign(Object.assign({}, (date && { iftarDate: new Date(date) })), (name && { name: { contains: name, mode: "insensitive" } })) : {},
                orderBy: {
                    serialNumber: "asc",
                },
            },
            mosque: {
                select: { name: true },
            },
            ramadanyear: true,
        },
    });
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPage: Math.ceil(total / Number(limit)),
        },
        data: result,
    };
});
const getIftarListByRamadanYearDB = (ramadanyearId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.ifterList.findMany({
        where: { ramadanyearId },
        include: {
            doners: {
                orderBy: {
                    serialNumber: "asc",
                },
            },
            ramadanyear: {
                select: {
                    id: true,
                    ramadanYear: true,
                    titleName: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
});
const updateifterlistDB = (id, doner) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.doner.update({
        where: { id },
        data: doner,
    });
});
const deleteifterlistDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.ifterList.findUnique({
        where: { id },
    });
    if (!existing) {
        throw new Error("Iftar list record not found!");
    }
    return yield prisma_1.default.ifterList.delete({
        where: { id },
    });
});
const deleteifterdonerDD = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.doner.findUnique({
        where: { id },
    });
    if (!existing) {
        throw new Error("Doner record not found!");
    }
    return yield prisma_1.default.doner.delete({
        where: { id },
    });
});
exports.ifterlistServices = {
    createlistDB,
    getifterlistDB,
    getIftarListByRamadanYearDB,
    updateifterlistDB,
    deleteifterlistDB,
    deleteifterdonerDD,
};
