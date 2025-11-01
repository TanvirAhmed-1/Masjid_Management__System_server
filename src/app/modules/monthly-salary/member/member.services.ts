import prisma from "../../../utils/prisma";
import { TMember } from "./member.interface";

const createMemberDB = async (payload: TMember) => {
  return await prisma.member.create({ data: payload });
};

const getAllMembersDB = async () => {
  return await prisma.member.findMany({
    include: { payments: true },
  });
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
  return await prisma.member.delete({
    where: { id },
  });
};

export const memberServices = {
  createMemberDB,
  getAllMembersDB,
  getMemberByIdDB,
  updateMenberDB,
  deleteMemberDB,
};
