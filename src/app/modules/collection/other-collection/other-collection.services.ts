// import prisma from "../../../utils/prisma";

// const createcollectionDB = async (data: any) => {
//   const existingCollection = await prisma.otherCollection.findFirst({
//     where: {
//       otherCollectionNameId: data.otherCollectionNameId,
//     },
//   });

//   if (existingCollection) {
//     // Merge new donors
//     const updatedDonors = [...existingCollection.donors, ...data.donors];

//     // Remove duplicate
//     const uniqueDonors = updatedDonors.reduce((acc: any[], curr) => {
//       if (!acc.find((d) => d.name === curr.name && d.amount === curr.amount)) {
//         acc.push(curr);
//       }
//       return acc;
//     }, []);

//     // Update existing collection
//     return await prisma.otherCollection.update({
//       where: { id: existingCollection.id },
//       data: {
//         donors: uniqueDonors,
//         date: data.date || existingCollection.date,
//       },
//     });
//   } else {
//     // Create new collection
//     return await prisma.otherCollection.create({
//       data,
//     });
//   }
// };
// const getAllCollectionsDB = async () => {
//   return await prisma.otherCollection.findMany({
//     include: {
//       otherCollectionName: true,
//     },
//     orderBy: { createdAt: "desc" },
//   });
// };

// const getCollectionByIdDB = async (id: string) => {
//   const collection = await prisma.otherCollection.findUnique({
//     where: { id },
//     include: {
//       otherCollectionName: {
//         select: { title: true },
//       },
//     },
//   });

//   if (!collection) {
//     throw new Error("Collection id not found");
//   }

//   return collection;
// };

// const deletecollectionDB = async (id: string) => {
//   const collection = await prisma.otherCollection.findUnique({ where: { id } });
//   if (!collection) throw new Error("Collection id not found");

//   return await prisma.otherCollection.delete({
//     where: { id },
//   });
// };
// const updateDonorsDB = async (
//   collectionId: string,
//   donorId: string,
//   newData: { name?: string; amount?: number }
// ) => {
//   const collection = await prisma.otherCollection.findUnique({
//     where: { id: collectionId },
//   });

//   if (!collection) throw new Error("Collection not found");

// const updateDonorDB = async (
//   donorId: string,
//   newData: { name?: string; amount?: number }
// ) => {
//   const donor = await prisma.donerName.findUnique({ where: { id: donorId } });
//   if (!donor) throw new Error("Donor not found");

//   return await prisma.donerName.update({
//     where: { id: donorId },
//     data: newData,
//   });
// };

// // -------------------- Delete Donor --------------------
// const deleteDonorDB = async (donorId: string) => {
//   const donor = await prisma.donerName.findUnique({ where: { id: donorId } });
//   if (!donor) throw new Error("Donor not found");

//   return await prisma.donerName.delete({ where: { id: donorId } });
// };


// export const otherCollectionService = {
//   deleteDonorDB,
//   createcollectionDB,
//   getAllCollectionsDB,
//   deletecollectionDB,
//   updateDonorsDB,
//   getCollectionByIdDB,
// };




import prisma from "../../../utils/prisma";

// -------------------- Create Collection --------------------
const createCollectionDB = async (data: {
  date?: Date;
  otherCollectionNameId: string;
  userId: string;
  donors?: { name: string; amount: number }[];
}) => {
  // Check if collection exists
  const existingCollection = await prisma.otherCollection.findFirst({
    where: { otherCollectionNameId: data.otherCollectionNameId },
  });

  if (existingCollection) {
    // Add new donors if provided
    if (data.donors && data.donors.length > 0) {
      for (const donor of data.donors) {
        await prisma.donerName.create({
          data: {
            name: donor.name,
            amount: donor.amount,
            collectionId: existingCollection.id,
          },
        });
      }
    }

    // Update date if provided
    return await prisma.otherCollection.update({
      where: { id: existingCollection.id },
      data: {
        date: data.date || existingCollection.date,
      },
      include: { donors: true },
    });
  } else {
    // Create new collection
    const collection = await prisma.otherCollection.create({
      data: {
        date: data.date,
        otherCollectionNameId: data.otherCollectionNameId,
        userId: data.userId,
        donors: data.donors
          ? {
              create: data.donors.map((donor) => ({
                name: donor.name,
                amount: donor.amount,
              })),
            }
          : undefined,
      },
      include: { donors: true },
    });
    return collection;
  }
};

// -------------------- Get All Collections --------------------
const getAllCollectionsDB = async () => {
  return await prisma.otherCollection.findMany({
    include: {
      otherCollectionName: true,
      donors: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// -------------------- Get Collection By ID --------------------
const getCollectionByIdDB = async (id: string) => {
  const collection = await prisma.otherCollection.findUnique({
    where: { id },
    include: {
      otherCollectionName: { select: { title: true } },
      donors: true,
    },
  });

  if (!collection) throw new Error("Collection id not found");
  return collection;
};

// -------------------- Delete Collection --------------------
const deleteCollectionDB = async (id: string) => {
  const collection = await prisma.otherCollection.findUnique({ where: { id } });
  if (!collection) throw new Error("Collection id not found");

  // Delete all donors first
  await prisma.donerName.deleteMany({ where: { collectionId: id } });

  return await prisma.otherCollection.delete({ where: { id } });
};

const updateColeectionDB = async (id: string, data: any) => {
  return await prisma.otherCollection.update({
    where: { id },
    data,
  });
}
// -------------------- Update Donor --------------------
const updateDonorDB = async (
  donorId: string,
  newData: { name?: string; amount?: number }
) => {
  const donor = await prisma.donerName.findUnique({ where: { id: donorId } });
  if (!donor) throw new Error("Donor not found");

  return await prisma.donerName.update({
    where: { id: donorId },
    data: newData,
  });
};

// -------------------- Delete Donor --------------------
const deleteDonorDB = async (donorId: string) => {
  const donor = await prisma.donerName.findUnique({ where: { id: donorId } });
  if (!donor) throw new Error("Donor not found");

  return await prisma.donerName.delete({ where: { id: donorId } });
};

// -------------------- Export Service --------------------
export const otherCollectionService = {
  createCollectionDB,
  getAllCollectionsDB,
  getCollectionByIdDB,
  deleteCollectionDB,
  updateColeectionDB,
  updateDonorDB,
  deleteDonorDB,
};

