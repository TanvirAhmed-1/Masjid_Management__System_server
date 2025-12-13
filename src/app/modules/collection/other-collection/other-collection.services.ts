import prisma from "../../../utils/prisma";

const createcollectionDB = async (data: any) => {
  // Check if collection with same otherCollectionNameId exists
  const existingCollection = await prisma.otherCollection.findFirst({
    where: {
      otherCollectionNameId: data.otherCollectionNameId,
    },
  });

  if (existingCollection) {
    // Merge new donors with existing donors
    const updatedDonors = [...existingCollection.donors, ...data.donors];

    // Remove duplicate donors (same name & amount)
    const uniqueDonors = updatedDonors.reduce((acc: any[], curr) => {
      if (!acc.find((d) => d.name === curr.name && d.amount === curr.amount)) {
        acc.push(curr);
      }
      return acc;
    }, []);

    // Update existing collection
    return await prisma.otherCollection.update({
      where: { id: existingCollection.id },
      data: {
        donors: uniqueDonors,
        date: data.date || existingCollection.date,
      },
    });
  } else {
    // Create new collection
    return await prisma.otherCollection.create({
      data,
    });
  }
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
