import prisma from "../../../utils/prisma";
import { ItikaInterface } from "./itikaf.interface";

const createItikaDB = async (payload: ItikaInterface) => {
  const result = await prisma.ifikafList.create({
    data: payload,
  });
  return result;
};

const getAllItikaDB = async (query: any) => {
  const {
    mosqueId,
    limit = 20,
    page = 1,
    sortBy = "createdAt",
    sortOrder = "desc",
    year,
    name,
  } = query;
  if (!mosqueId) throw new Error("Mosque ID is required");

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const whereCondition: any = { mosqueId };

  if (year) {
    whereCondition.ramadanYear = {
      is: {
        ramadanYear: year, 
      },
    };
  }

  if (name) {
    whereCondition.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  const result = await prisma.ifikafList.findMany({
    where: whereCondition,
    skip,
    take,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      ramadanYear: {
        select: {
          ramadanYear: true,
          titleName: true,
        },
      },
    },
  });
  const total = await prisma.ifikafList.count({ where: whereCondition });
  const totalPage = Math.ceil(total / Number(limit));
  return {
    meta: {
      total,
      page,
      limit,
      totalPage,
    },
    data: result,
  };
};

const getSingleItikaDB = async (ramadanId: string) => {
  const result = await prisma.ifikafList.findMany({
    where: { ramadanId },
  });
  return result;
};

const updateItikaDB = async (id: string, payload: Partial<ItikaInterface>) => {
  const existing = await prisma.ifikafList.findUnique({ where: { id } });
  if (!existing) throw new Error("Itika record not found!");

  const result = await prisma.ifikafList.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteItikaDB = async (id: string) => {
  const existing = await prisma.ifikafList.findUnique({ where: { id } });
  if (!existing) throw new Error("Itika record not found!");

  const result = await prisma.ifikafList.delete({
    where: { id },
  });
  return result;
};

export const itikaServices = {
  createItikaDB,
  getAllItikaDB,
  getSingleItikaDB,
  updateItikaDB,
  deleteItikaDB,
};
