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
exports.otherCollectionService = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const createCollectionDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.mosqueId)
        throw new Error("Mosque ID is required");
    if (!data.otherCollectionNameId)
        throw new Error("Collection Name ID is required");
    // Verify otherCollectionName belongs to this mosque
    const collectionName = yield prisma_1.default.otherCollectionName.findUnique({
        where: { id: data.otherCollectionNameId },
        select: { mosqueId: true, title: true },
    });
    if (!collectionName) {
        throw new Error("Collection name not found");
    }
    if (collectionName.mosqueId !== data.mosqueId) {
        throw new Error("Collection name doesn't belong to this mosque");
    }
    // Check if collection already exists for this date and collection name
    const existingCollection = yield prisma_1.default.otherCollection.findFirst({
        where: {
            otherCollectionNameId: data.otherCollectionNameId,
            mosqueId: data.mosqueId,
            date: data.date, // Same date check
        },
    });
    if (existingCollection) {
        // Add new donors to existing collection
        if (data.donors && data.donors.length > 0) {
            yield prisma_1.default.donerName.createMany({
                data: data.donors.map((donor) => ({
                    name: donor.name,
                    amount: donor.amount,
                    collectionId: existingCollection.id,
                })),
            });
        }
        // Return updated collection with all donors
        return yield prisma_1.default.otherCollection.findUnique({
            where: { id: existingCollection.id },
            include: {
                donors: {
                    orderBy: { createdAt: "desc" },
                },
                otherCollectionName: {
                    select: { title: true, description: true },
                },
            },
        });
    }
    else {
        // Create new collection with mosqueId
        const collection = yield prisma_1.default.otherCollection.create({
            data: {
                date: data.date,
                otherCollectionNameId: data.otherCollectionNameId,
                userId: data.userId,
                mosqueId: data.mosqueId, // Important: মসজিদ ID সেট করুন
                donors: data.donors && data.donors.length > 0
                    ? {
                        create: data.donors.map((donor) => ({
                            name: donor.name,
                            amount: donor.amount,
                        })),
                    }
                    : undefined,
            },
            include: {
                donors: {
                    orderBy: { createdAt: "desc" },
                },
                otherCollectionName: {
                    select: { title: true, description: true },
                },
            },
        });
        return collection;
    }
});
// -------------------- Get All Collections --------------------
const getAllCollectionsDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { mosqueId, name, fromDate, toDate, page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc", } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    if (!mosqueId)
        throw new Error("Mosque ID is required");
    // Where condition
    const whereCondition = {
        otherCollectionName: { mosqueId },
    };
    if (fromDate && toDate) {
        whereCondition.date = {
            gte: new Date(fromDate),
            lte: new Date(toDate),
        };
    }
    if (name) {
        whereCondition.otherCollectionName = Object.assign(Object.assign({}, whereCondition.otherCollectionName), { title: {
                contains: name,
                mode: "insensitive",
            } });
    }
    // Fetch data
    const data = yield prisma_1.default.otherCollection.findMany({
        where: whereCondition,
        include: {
            otherCollectionName: { select: { title: true } },
            donors: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take,
    });
    const total = yield prisma_1.default.otherCollection.count({
        where: whereCondition,
    });
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPage: Math.ceil(total / Number(limit)) || 1,
        },
        data,
    };
});
// -------------------- Get Collection By ID --------------------
const getCollectionByIdDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, mosqueId, donorName, fromDate, toDate, amount, page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc", } = query;
    if (!mosqueId)
        throw new Error("Mosque ID is required");
    if (!id)
        throw new Error("Collection ID is required");
    // First, verify the collection exists and belongs to this mosque
    const collectionCheck = yield prisma_1.default.otherCollection.findUnique({
        where: { id },
        select: { mosqueId: true },
    });
    if (!collectionCheck) {
        throw new Error("Collection not found");
    }
    if (collectionCheck.mosqueId !== mosqueId) {
        throw new Error("This collection does not belong to your mosque");
    }
    // Build donor filter condition
    const donorWhereCondition = {};
    if (donorName) {
        donorWhereCondition.name = {
            contains: donorName,
            mode: "insensitive",
        };
    }
    if (fromDate && toDate) {
        donorWhereCondition.createdAt = {
            gte: new Date(fromDate),
            lte: new Date(toDate),
        };
    }
    if (amount) {
        donorWhereCondition.amount = Number(amount);
    }
    // Get total count of filtered donors
    const totalDonors = yield prisma_1.default.donerName.count({
        where: Object.assign({ collectionId: id }, donorWhereCondition),
    });
    // Fetch collection with filtered and paginated donors
    const collection = yield prisma_1.default.otherCollection.findUnique({
        where: { id },
        include: {
            otherCollectionName: {
                select: {
                    title: true,
                    description: true,
                },
            },
            mosque: {
                select: {
                    name: true,
                },
            },
            donors: {
                where: donorWhereCondition,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
            },
        },
    });
    console.log("Donors returned:", collection === null || collection === void 0 ? void 0 : collection.donors.length);
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total: totalDonors,
            totalPage: Math.ceil(totalDonors / Number(limit)) || 1,
        },
        data: collection,
    };
});
// -------------------- Delete Collection --------------------
const deleteCollectionDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield prisma_1.default.otherCollection.findUnique({ where: { id } });
    if (!collection)
        throw new Error("Collection id not found");
    // Delete all donors first
    yield prisma_1.default.donerName.deleteMany({ where: { collectionId: id } });
    return yield prisma_1.default.otherCollection.delete({ where: { id } });
});
const updateColeectionDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.otherCollection.update({
        where: { id },
        data,
    });
});
const createDonerDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    //  Check collection exists
    const collection = yield prisma_1.default.otherCollection.findUnique({
        where: { id: data.collectionId },
    });
    if (!collection) {
        throw new Error("Collection not found");
    }
    // Create donor
    return yield prisma_1.default.donerName.create({
        data: {
            name: data.name,
            amount: data.amount,
            collectionId: data.collectionId,
        },
    });
});
//  Update Donor
const updateDonorDB = (donorId, newData) => __awaiter(void 0, void 0, void 0, function* () {
    const donor = yield prisma_1.default.donerName.findUnique({ where: { id: donorId } });
    if (!donor)
        throw new Error("Donor not found");
    return yield prisma_1.default.donerName.update({
        where: { id: donorId },
        data: newData,
    });
});
//  Delete Donor
const deleteDonorDB = (donorId) => __awaiter(void 0, void 0, void 0, function* () {
    const donor = yield prisma_1.default.donerName.findUnique({ where: { id: donorId } });
    if (!donor)
        throw new Error("Donor not found");
    return yield prisma_1.default.donerName.delete({ where: { id: donorId } });
});
// -------------------- Export Service --------------------
exports.otherCollectionService = {
    createCollectionDB,
    getAllCollectionsDB,
    getCollectionByIdDB,
    deleteCollectionDB,
    updateColeectionDB,
    updateDonorDB,
    deleteDonorDB,
    createDonerDB,
};
