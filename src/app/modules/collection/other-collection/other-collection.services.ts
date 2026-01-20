import prisma from "../../../utils/prisma";

const createCollectionDB = async (data: {
  date: Date;
  otherCollectionNameId: string;
  userId: string;
  mosqueId: string;
  donors: { name: string; amount: number }[];
}) => {
  if (!data.mosqueId) throw new Error("Mosque ID is required");
  if (!data.otherCollectionNameId)
    throw new Error("Collection Name ID is required");

  // Verify otherCollectionName belongs to this mosque
  const collectionName = await prisma.otherCollectionName.findUnique({
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
  const existingCollection = await prisma.otherCollection.findFirst({
    where: {
      otherCollectionNameId: data.otherCollectionNameId,
      mosqueId: data.mosqueId,
      date: data.date, // Same date check
    },
  });

  if (existingCollection) {
    // Add new donors to existing collection
    if (data.donors && data.donors.length > 0) {
      await prisma.donerName.createMany({
        data: data.donors.map((donor) => ({
          name: donor.name,
          amount: donor.amount,
          collectionId: existingCollection.id,
        })),
      });
    }

    // Return updated collection with all donors
    return await prisma.otherCollection.findUnique({
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
  } else {
    // Create new collection with mosqueId
    const collection = await prisma.otherCollection.create({
      data: {
        date: data.date,
        otherCollectionNameId: data.otherCollectionNameId,
        userId: data.userId,
        mosqueId: data.mosqueId, // Important: মসজিদ ID সেট করুন
        donors:
          data.donors && data.donors.length > 0
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
};
// -------------------- Get All Collections --------------------
const getAllCollectionsDB = async (query: any) => {
  const {
    mosqueId,
    name,
    fromDate,
    toDate,
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  if (!mosqueId) throw new Error("Mosque ID is required");

  // Where condition
  const whereCondition: any = {
    otherCollectionName: { mosqueId },
  };

  if (fromDate && toDate) {
    whereCondition.date = {
      gte: new Date(fromDate),
      lte: new Date(toDate),
    };
  }

  if (name) {
    whereCondition.otherCollectionName = {
      ...whereCondition.otherCollectionName,
      title: {
        contains: name,
        mode: "insensitive",
      },
    };
  }

  // Fetch data
  const data = await prisma.otherCollection.findMany({
    where: whereCondition,
    include: {
      otherCollectionName: { select: { title: true } },
      donors: true,
    },
    orderBy: { [sortBy]: sortOrder },
    skip,
    take,
  });

  const total = await prisma.otherCollection.count({
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

// -------------------- Get Collection By ID --------------------
const getCollectionByIdDB = async (query: any) => {
  const {
    id,
    mosqueId,
    donorName,
    fromDate,
    toDate,
    amount,
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  // Debug log
  console.log("Filtering donors with:", {
    donorName,
    fromDate,
    toDate,
    amount,
  });

  if (!mosqueId) throw new Error("Mosque ID is required");
  if (!id) throw new Error("Collection ID is required");

  // First, verify the collection exists and belongs to this mosque
  const collectionCheck = await prisma.otherCollection.findUnique({
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
  const donorWhereCondition: any = {};

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

  // Debug log
  console.log("Final donor where condition:", JSON.stringify(donorWhereCondition, null, 2));

  // Get total count of filtered donors
  const totalDonors = await prisma.donerName.count({
    where: {
      collectionId: id,
      ...donorWhereCondition,
    },
  });

  console.log("Total donors found:", totalDonors);

  // Fetch collection with filtered and paginated donors
  const collection = await prisma.otherCollection.findUnique({
    where: { id },
    include: {
      otherCollectionName: {
        select: {
          title: true,
          description: true,
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

  console.log("Donors returned:", collection?.donors.length);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total: totalDonors,
      totalPage: Math.ceil(totalDonors / Number(limit)) || 1,
    },
    data: collection,
  };
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
};

const createDonerDB = async (data: {
  collectionId: string;
  name: string;
  amount: number;
}) => {
  //  Check collection exists
  const collection = await prisma.otherCollection.findUnique({
    where: { id: data.collectionId },
  });

  if (!collection) {
    throw new Error("Collection not found");
  }

  // Create donor
  return await prisma.donerName.create({
    data: {
      name: data.name,
      amount: data.amount,
      collectionId: data.collectionId,
    },
  });
};

//  Update Donor
const updateDonorDB = async (
  donorId: string,
  newData: { name?: string; amount?: number },
) => {
  const donor = await prisma.donerName.findUnique({ where: { id: donorId } });
  if (!donor) throw new Error("Donor not found");
  return await prisma.donerName.update({
    where: { id: donorId },
    data: newData,
  });
};

//  Delete Donor
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
  createDonerDB,
};
