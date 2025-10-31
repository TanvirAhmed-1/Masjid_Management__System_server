import prisma from "../../../utils/prisma";
import { Doner, IfterListInterface } from "./ifterlist.interface";

// const createlistDB = async (payload: IfterListInterface) => {
//   const { ramadanyearId, doners, userId, ...data } = payload;

//   const existing = await prisma.ifterList.findFirst({
//     where: { ramadanyearId },
//   });

//   if (!existing) {
//     throw new Error("Iftar list not found!");
//   }

//   if (existing) {
//    return await prisma.doner.createMany({
//      data: doners
//    })
//   }
//   return await prisma.ifterList.create({
//     data: {
//       ramadanyearId,
//       userId,
//       ...data,
//       doners: {
//         create: doners,
//       },
//     },
//     include: { doners: true },
//   });
// };

const createlistDB = async (payload: IfterListInterface) => {
  const { ramadanyearId, doners, userId, ...data } = payload;

  // Find existing IfterList for this Ramadan year
  const existing = await prisma.ifterList.findFirst({
    where: { ramadanyearId },
    include: { doners: true },
  });

  if (existing) {
    // Simply add all donors to the existing list
    await prisma.doner.createMany({
      data: doners.map((d) => ({
        serialNumber: d.serialNumber,
        name: d.name,
        iftarDate: new Date(d.iftarDate),
        dayName: d.dayName,
        ifterListId: existing.id,
      })),
    });

    // Return the updated list
    return prisma.ifterList.findUnique({
      where: { id: existing.id },
      include: { doners: true },
    });
  }

  // If no existing list, create a new IfterList with donors
  const newList = await prisma.ifterList.create({
    data: {
      ramadanyearId,
      userId,
      ...data,
      doners: {
        create: doners.map((d) => ({
          serialNumber: d.serialNumber,
          name: d.name,
          iftarDate: new Date(d.iftarDate),
          dayName: d.dayName,
        })),
      },
    },
    include: { doners: true },
  });

  return newList;
};

const getifterlistDB = async () => {
  return await prisma.ifterList.findMany({
    include: {
      doners: {
        orderBy: {
          iftarDate: "asc",
        },
      },
      ramadanyear: {
        select: {
          id: true,
          ramadanYear: true,
          titleName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getIftarListByRamadanYearDB = async (ramadanyearId: string) => {
  return await prisma.ifterList.findMany({
    where: { ramadanyearId },
    include: {
      doners: {
        orderBy: {
          serialNumber: "asc",
        },
      },
      ramadanyear: {
        select: {
          id: true,
          ramadanYear: true,
          titleName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// const updateifterlistDB = async (
//   id: string,
//   payload: Partial<IfterListInterface>
// ) => {
//   // Extract fields that shouldn't be updated directly
//   const { ramadanyearId, userId, doners, ...updateData } = payload;

//   return await prisma.ifterList.update({
//     where: { id },
//     data: updateData,
//   });
// };

const updateifterlistDB = async (id: string, doner: Partial<Doner>) => {
  return await prisma.doner.update({
    where: { id },
    data: doner,
  });
};

const deleteifterlistDB = async (id: string) => {
  const existing = await prisma.ifterList.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Iftar list record not found!");
  }

  return await prisma.ifterList.delete({
    where: { id },
  });
};

const deleteifterdonerDD = async (id: string) => {
  const existing = await prisma.doner.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Doner record not found!");
  }

  return await prisma.doner.delete({
    where: { id },
  });
};

export const ifterlistServices = {
  createlistDB,
  getifterlistDB,
  getIftarListByRamadanYearDB,
  updateifterlistDB,
  deleteifterlistDB,
  deleteifterdonerDD,
};
