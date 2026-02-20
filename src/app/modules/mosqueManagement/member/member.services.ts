import prisma from "../../../utils/prisma";
import { ICreateMemberInput } from "./member.interface";
import bcrypt from "bcrypt";

// MEMBER create
const createMemberDB = async (payload: ICreateMemberInput, userId: string) => {
  const { password, ...rest } = payload;

  // password hash
  const hashedPassword = await bcrypt.hash(password, 12);

  return await prisma.$transaction(async (tx) => {
    const createdMember = await tx.user.create({
      data: {
        ...rest,
        password: hashedPassword,
        role: "MEMBER",
        mosqueId: payload.mosqueId,
      },
    });

    return createdMember;
  });
};

const getAllMembersDB = async ({ mosqueId, name, email, phone }: any) => {
  return await prisma.user.findMany({
    where: {
      role: "MEMBER",
      ...(mosqueId && { mosqueId }),
      ...(name && { name: { contains: name, mode: "insensitive" } }),
      ...(email && { email: { contains: email, mode: "insensitive" } }),
      ...(phone && { phone: { contains: phone } }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      gender: true,
      createdAt: true,
      mosque: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// Get MEMBER by ID
const getMemberByIdDB = async (id: string) => {
  const idExist = await prisma.user.findUnique({ where: { id } });
  if (!idExist) throw new Error("Member not found");
  const member = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      gender: true,
      mosqueId: true,
      createdAt: true,
    },
  });

  if (!member) throw new Error("Member not found");
  return member;
};

// Update MEMBER
const updateMemberDB = async (
  id: string,
  payload: Partial<Omit<ICreateMemberInput, "mosqueId">>,
) => {
  // if password exists, hash it
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 12);
  }

  return await prisma.user.update({
    where: { id },
    data: payload,
  });
};

// Delete MEMBER
const deleteMemberDB = async (id: string, mosqueId?: string) => {
  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists) throw new Error("Member not found");
  if (mosqueId && exists.mosqueId !== mosqueId) {
    throw new Error("Member does not belong to this mosque");
  }
  return await prisma.user.delete({ where: { id } });
};

// Export services
export const memberServices = {
  createMemberDB,
  getAllMembersDB,
  getMemberByIdDB,
  updateMemberDB,
  deleteMemberDB,
};
