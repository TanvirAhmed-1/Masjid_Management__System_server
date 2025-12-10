import prisma from "../../../utils/prisma";
import { IOtherCollectionName } from "./otherCollectionName.interface";

const createcollectionName = async (data: IOtherCollectionName) => {
  return await prisma.otherCollectionName.create({
    data: data,
  });
};

const getallcollectionName = async () => {
  return await prisma.otherCollectionName.findMany({
    orderBy: { createdAt: "desc" },
  });
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
  data: Partial<IOtherCollectionName>
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
  getallcollectionName,
  deletecollectionName,
  updatecollectionName,
};
