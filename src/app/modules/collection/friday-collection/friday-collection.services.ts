import prisma from "../../../utils/prisma";
import { IFridayCollection } from "./friday-collection.interface";

const createFridayCollectionDB = async (payloed: IFridayCollection) => {
  return await prisma.fridayCollection.create({
    data: {
      amount: payloed.amount,
      userId: payloed.userId,
    },
  });
};

const getallcollectionDB = async () => {
  return await prisma.fridayCollection.findMany({
    orderBy: { createdAt: "desc" },
  });
};
const deleteFridayCollectionDB = async (id: string) => {
  const collection = await prisma.fridayCollection.findUnique({ where: { id } });
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
