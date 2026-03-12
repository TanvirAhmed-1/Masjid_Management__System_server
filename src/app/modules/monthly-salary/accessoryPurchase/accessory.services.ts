import prisma from "../../../utils/prisma";
import { TAccessoryPurchase } from "./accessory.interface";

const createPurchaseDB = async (payload: TAccessoryPurchase) => {
  if (!payload.mosqueId) {
    throw new Error("Mosque ID is required");
  }
  return await prisma.memberAccessoryPurchase.create({ data: payload });
};

const getAllPurchasesDB = async (query: any) => {
  const {
    mosqueId,
    limit = 20,
    page = 1,
    sortBy = "purchaseDate",
    sortOrder = "desc",
    itemName,
    memberName,
    from, // starting date
    to, // ending date
  } = query;

  if (!mosqueId) {
    throw new Error("Mosque ID is required");
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const whereCondition: any = { mosqueId };
  if (itemName) {
    whereCondition.itemName = { contains: itemName, mode: "insensitive" };
  }

  if (memberName) {
    whereCondition.memberName = { contains: memberName, mode: "insensitive" };
  }

  if (from || to) {
    whereCondition.createdAt = {};
    if (from) {
      whereCondition.createdAt.gte = new Date(from);
    }
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      whereCondition.createdAt.lte = toDate;
    }
  }

  const result = await prisma.memberAccessoryPurchase.findMany({
    where: whereCondition,
    skip,
    take,
    orderBy: { [sortBy]: sortOrder },
    include: { user: true },
  });

  const total = await prisma.memberAccessoryPurchase.count({
    where: whereCondition,
  });

  return {
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPage: Math.ceil(total / Number(limit)),
    },
    data: result,
  };
};

const getPurchaseByIdDB = async (id: string) => {
  return await prisma.memberAccessoryPurchase.findUnique({
    where: { id },
    include: { user: true, mosque: true },
  });
};

const updatePurchaseDB = async (
  id: string,
  payload: Partial<TAccessoryPurchase>,
) => {
  return await prisma.memberAccessoryPurchase.update({
    where: { id },
    data: payload,
  });
};

const deletePurchaseDB = async (id: string) => {
  console.log(id);
  const isExist = await prisma.memberAccessoryPurchase.findUnique({
    where: { id },
  });
  if (!isExist) throw new Error("Purchase record not found");

  return await prisma.memberAccessoryPurchase.delete({ where: { id } });
};

export const accessoryPurchaseServices = {
  createPurchaseDB,
  getAllPurchasesDB,
  getPurchaseByIdDB,
  updatePurchaseDB,
  deletePurchaseDB,
};
