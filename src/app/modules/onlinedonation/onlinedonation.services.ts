import prisma from "../../utils/prisma";
import {
  BkashCredentialInterface,
  OnlineDonationInterface,
} from "./onlinedonation.interface";

const saveBkashCredentialDB = async (payload: BkashCredentialInterface) => {
  return await prisma.bkashCredential.upsert({
    where: { mosqueId: payload.mosqueId },
    update: payload,
    create: payload,
  });
};

const createDonationRecordDB = async (payload: OnlineDonationInterface) => {
  return await prisma.onlineDonation.create({
    data: payload,
  });
};

const updateDonationStatusDB = async (
  paymentID: string,
  trxID: string,
  status: any,
) => {
  return await prisma.onlineDonation.update({
    where: { paymentID },
    data: {
      trxID: trxID,
      status: status,
    },
  });
};

const getDonationsDB = async (query: any) => {
  const {
    mosqueId,
    limit = 20,
    page = 1,
    sortBy = "createdAt",
    sortOrder = "desc",
    searchTerm, // name বা phone এর জন্য
    from, // Start Date
    to, // End Date
  } = query;

  if (!mosqueId) {
    throw new Error("Mosque ID is required");
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Filters logic
  const whereCondition: any = { mosqueId };

  // Search by name or phone
  if (searchTerm) {
    whereCondition.OR = [
      { donorName: { contains: searchTerm, mode: "insensitive" } },
      { donorPhone: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  // Date range filtering (From - To)
  if (from || to) {
    whereCondition.createdAt = {};
    if (from) {
      whereCondition.createdAt.gte = new Date(from); // Greater than or equal
    }
    if (to) {
      whereCondition.createdAt.lte = new Date(to); // Less than or equal
    }
  }

  const total = await prisma.onlineDonation.count({
    where: whereCondition,
  });

  const result = await prisma.onlineDonation.findMany({
    where: whereCondition,
    skip,
    take,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      mosque: {
        select: { name: true },
      },
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
};

export const onlineDonationServices = {
  saveBkashCredentialDB,
  createDonationRecordDB,
  updateDonationStatusDB,
  getDonationsDB,
};
