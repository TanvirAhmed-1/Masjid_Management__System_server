import prisma from "../../../utils/prisma";
import { IFridayCollection } from "./friday-collection.interface";

const createFridayCollectionDB = async (payload: IFridayCollection) => {
  // Normalize incoming date to YYYY-MM-DD
  const incomingDate = new Date(payload.collectionDate).toISOString().split("T")[0];

  // Check if already exists for that day
  const isExists = await prisma.fridayCollection.findFirst({
    where: {
      collectionDate: {
        gte: new Date(`${incomingDate}T00:00:00.000Z`),
        lte: new Date(`${incomingDate}T23:59:59.999Z`),
      },
    },
  });

  if (isExists) {
    throw new Error("Friday Collection for this date already exists");
  }

  // Create collection
  return await prisma.fridayCollection.create({
    data: {
      amount: payload.amount,
      collectionDate: new Date(payload.collectionDate),
      userId: payload.userId,
      mosqueId: payload.mosqueId,
    },
  });
};
const upsertFridayCollectionDB = async (payload: IFridayCollection) => {
  // Normalize incoming date to YYYY-MM-DD
  const incomingDate = new Date(payload.collectionDate).toISOString().split("T")[0];

  // Check if a collection exists for that day
  const existingCollection = await prisma.fridayCollection.findFirst({
    where: {
      collectionDate: {
        gte: new Date(`${incomingDate}T00:00:00.000Z`),
        lte: new Date(`${incomingDate}T23:59:59.999Z`),
      },
    },
  });

  if (existingCollection) {
    // Update the existing collection
    return await prisma.fridayCollection.update({
      where: { id: existingCollection.id },
      data: {
        amount: payload.amount,
        collectionDate: new Date(payload.collectionDate),
        userId: payload.userId,
      },
    });
  }

  // Otherwise, create a new collection
  return await prisma.fridayCollection.create({
    data: {
      amount: payload.amount,
      collectionDate: new Date(payload.collectionDate),
      userId: payload.userId,
    },
  });
};




const getallcollectionDB = async () => {
  return await prisma.fridayCollection.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });
};
const deleteFridayCollectionDB = async (id: string) => {
  const collection = await prisma.fridayCollection.findUnique({
    where: { id },
  });
  if (!collection) throw new Error("Friday Collection id not found");
  return await prisma.fridayCollection.delete({
    where: { id },
  });
};
const updateFridayCollectionDB = async (
  id: string,
  payloed: Partial<IFridayCollection>
) => {
  const isExits = await prisma.fridayCollection.findUnique({
    where: { id },
  });
  if (!isExits) throw new Error("Friday Collection id not found");
  return await prisma.fridayCollection.update({
    where: { id },
    data: payloed,
  });
};
export const FridayCollectionServices = {
  createFridayCollectionDB,
  getallcollectionDB,
  deleteFridayCollectionDB,
  updateFridayCollectionDB,
};
