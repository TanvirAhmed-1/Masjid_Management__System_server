import prisma from "../../../utils/prisma";

const createcollectionDB = async (data: any) => {
  return await prisma.otherCollection.create({
    data: data,
  });
};
const getAllCollectionsDB = async () => {
  return await prisma.otherCollection.findMany({
    include: {
      otherCollectionName: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const deletecollectionDB = async (id: string) => {
  const collection = await prisma.otherCollection.findUnique({ where: { id } });
  if (!collection) throw new Error("Collection id not found");

  return await prisma.otherCollection.delete({
    where: { id },
  });
};
const updateDonorsDB = async (id: string, donors: any[]) => {
    const collection = await prisma.otherCollection.findUnique({ where: { id } });
    if (!collection) throw new Error("Collection id not found");
  return await prisma.otherCollection.update({
    where: { id },
    data: { donors },
  });
};

export const otherCollectionService = {
  createcollectionDB,
  getAllCollectionsDB,
  deletecollectionDB,
  updateDonorsDB,
};
