import prisma from "../../../utils/prisma";
import { IStaff } from "./satff.interface";

const createstffDB = async (payload: IStaff) => {
  return await prisma.staff.create({
    data: payload,
  });
};

const getAllstaffDB = async (query: any) => {
  const {
    mosqueId,
    limit = 20,
    page = 1,
    sortBy = "createdAt",
    sortOrder = "desc",
    name,
    phone,
  } = query;
  if (!mosqueId) throw new Error("Mosque ID is required");
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const whereCondition: any = { mosqueId };
  if (name) {
    whereCondition.name = {
      contains: name,
      mode: "insensitive",
    };
  }
  if (phone) {
    whereCondition.phone = {
      contains: phone,
      mode: "insensitive",
    };
  }
  const result = await prisma.staff.findMany({
    where: whereCondition,
    skip,
    take,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.staff.count({ where: whereCondition });
  const totalPage = Math.ceil(total / Number(limit));
  return {
    data: result,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPage,
    },
  };
};

const getstaffByIdDB = async (id: string) => {
  if (!id) throw new Error("Id is required");
  return await prisma.staff.findUnique({
    where: { id },
  });
};
const updatestaffDB = async (id: string, payload: Partial<IStaff>) => {
  if (!id) throw new Error("Id is required");
  return await prisma.staff.update({
    where: { id },
    data: payload,
  });
};

const deletestaffDB = async (id: string) => {
  const staff = await prisma.staff.findUnique({ where: { id } });
  if (!staff) throw new Error("Staff not found");

  return await prisma.staff.delete({ where: { id } });
};
export const staffServices = {
  createstffDB,
  getAllstaffDB,
  getstaffByIdDB,
  updatestaffDB,
  deletestaffDB,
};
