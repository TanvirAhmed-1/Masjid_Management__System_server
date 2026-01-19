import prisma from "../../../utils/prisma";
import { IOtherCollectionName } from "./otherCollectionName.interface";

const createcollectionName = async (data: IOtherCollectionName) => {
  return await prisma.otherCollectionName.create({
    data: data,
  });
};

const getAllCollectionName = async (query: any) => {
  const {
    mosqueId,
    page = 1,
    limit = 30,
    sortBy = "createdAt",
    sortOrder = "desc",
    fromDate,
    toDate,
  } = query;

  if (!mosqueId) {
    throw new Error("Mosque ID is required");
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Where condition
  const whereCondition: any = { mosqueId };

  if (fromDate && toDate) {
    whereCondition.collectionDate = {
      gte: new Date(fromDate),
      lte: new Date(toDate),
    };
  }

  // Fetch data
  const data = await prisma.otherCollectionName.findMany({
    where: whereCondition,
    orderBy: { [sortBy]: sortOrder },
    skip,
    take,
  });

  // Total count
  const total = await prisma.otherCollectionName.count({
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
};

const deletecollectionName = async (id: string) => {
  const collectionName = await prisma.otherCollectionName.findUnique({
    where: { id },
  });
  if (!collectionName) throw new Error("Collection Name id not found");
  return await prisma.otherCollectionName.delete({
    where: { id },
  });
};
const updatecollectionName = async (
  id: string,
  data: Partial<IOtherCollectionName>,
) => {
  const isExits = await prisma.otherCollectionName.findUnique({
    where: { id },
  });
  if (!isExits) throw new Error("Collection Name id not found");
  return await prisma.otherCollectionName.update({
    where: { id },
    data: data,
  });
};

export const OtherCollectionNameServices = {
  createcollectionName,
  getAllCollectionName,
  deletecollectionName,
  updatecollectionName,
};
