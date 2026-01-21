import prisma from "../../../utils/prisma";
import { RamadanYearInterface } from "./ramadan-datasetup.interface";

const createrRamadanDataSetupDB = async (payload: RamadanYearInterface) => {
  return await prisma.ramadanYear.create({
    data: payload,
  });
};

const fetchRamadanDataDB = async (query: any) => {
  const {
    mosqueId,
    limit = 10,
    page = 1,
    sortBy = "createdAt",
    sortOrder = "desc",
    year,
  } = query;

  if (!mosqueId) {
    throw new Error("Mosque ID is required");
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const whereCondition: any = {
    mosqueId,
  };

  // year optional filter
  if (year) {
    whereCondition.ramadanYear = year;
  }

  const data = await prisma.ramadanYear.findMany({
    where: whereCondition,
    skip,
    take,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.ramadanYear.count({
    where: whereCondition,
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit)),
    },
    data,
  };
};

const updateRamadanDataSetupBD = async (
  ramadanyearId: string,
  payload: Partial<RamadanYearInterface>,
) => {
  const exitstingId = await prisma.ramadanYear.findUnique({
    where: { id: ramadanyearId },
  });

  if (!exitstingId) {
    throw new Error("Id not Exiting!");
  }
  return await prisma.ramadanYear.update({
    where: { id: ramadanyearId },
    data: payload,
  });
};

const deleteRamadanDataSetupBD = async (ramadanyearId: string) => {
  const exitstingId = await prisma.ramadanYear.findUnique({
    where: { id: ramadanyearId },
  });

  if (!exitstingId) {
    throw new Error("Id not Exiting!");
  }
  return await prisma.ramadanYear.delete({
    where: { id: ramadanyearId },
  });
};

export const dateSetUpServicess = {
  deleteRamadanDataSetupBD,
  updateRamadanDataSetupBD,
  fetchRamadanDataDB,
  createrRamadanDataSetupDB,
};
