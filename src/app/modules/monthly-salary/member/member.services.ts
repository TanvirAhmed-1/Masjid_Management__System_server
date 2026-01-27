import prisma from "../../../utils/prisma";
import { TMember } from "./member.interface";

const createMemberDB = async (payload: TMember) => {
  const { mosqueId, phone } = payload;

  if (!mosqueId) {
    throw new Error("Mosque ID is required");
  }
  return await prisma.member.create({ data: payload });
};

const getAllMembersDB = async (query: any) => {
  const {
    mosqueId,
    limit = 20,
    page = 1,
    sortBy = "createdAt",
    sortOrder = "desc",
    name,
    phone,
    address,
  } = query;

  if (!mosqueId) {
    throw new Error("Mosque ID is required");
  }
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const whereCondition: any = { mosqueId };

  if (name) {
    whereCondition.name = { contains: name, mode: "insensitive" };
  }
  if (phone) {
    whereCondition.phone = { contains: phone, mode: "insensitive" };
  }
  if (address) {
    whereCondition.address = { contains: address, mode: "insensitive" };
  }
  const result = await prisma.member.findMany({
    where: whereCondition,
    skip,
    take,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: { payments: true },
  });

  const total = await prisma.member.count({ where: whereCondition });

  return {
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPage: Math.ceil(total / Number(limit)),
    },
    data: result,
  };
};

const getMemberByIdDB = async (id: string) => {
  return await prisma.member.findUnique({
    where: { id },
    include: { payments: true },
  });
};

const updateMenberDB = async (id: string, payload: Partial<TMember>) => {
  return await prisma.member.update({
    where: { id },
    data: payload,
  });
};

const deleteMemberDB = async (id: string) => {
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) throw new Error("Member not found");

  return await prisma.member.delete({ where: { id } });
};

export const memberServices = {
  createMemberDB,
  getAllMembersDB,
  getMemberByIdDB,
  updateMenberDB,
  deleteMemberDB,
};
