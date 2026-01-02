import prisma from "../../utils/prisma";
import { CreateMosqueWithAdminInput } from "./mosque.interface";

import bcrypt from "bcrypt";

const createMosqueWithAdminDB = async (
  payload: CreateMosqueWithAdminInput,
  superAdminId: string
) => {
  const { mosque, admin } = payload;

  const hashedPassword = await bcrypt.hash(admin.password, 12);

  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Create Mosque
    const createdMosque = await tx.mosque.create({
      data: {
        ...mosque,
        createdBy: superAdminId,
      },
    });

    // 2️⃣ Create Admin User
    const createdAdmin = await tx.user.create({
      data: {
        name: admin.name,
        email: admin.email,
        password: hashedPassword,
        address: admin.address,
        gender: admin.gender,
        phone: admin.phone,
        role: "ADMIN",
        mosqueId: createdMosque.id,
      },
    });

    return {
      mosque: createdMosque,
      admin: createdAdmin,
    };
  });
};

const getAllMosquesDB = async () => {
  return await prisma.mosque.findMany({
    include: { users: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const getMosqueByIdDB = async (id: string) => {
  const isExist = await prisma.mosque.findUnique({ where: { id } });
  if (!isExist) throw new Error("Mosque not found");
  return await prisma.mosque.findUnique({ where: { id } });
};

const updateMosqueDB = async (
  id: string,
  payload: Partial<CreateMosqueWithAdminInput["mosque"]>
) => {
  return await prisma.mosque.update({ where: { id }, data: payload });
};

const deleteMosqueDB = async (id: string) => {
  const isExist = await prisma.mosque.findUnique({ where: { id } });
  if (!isExist) throw new Error("Mosque not found");
  return await prisma.mosque.delete({ where: { id } });
};

export const mosqueServices = {
  createMosqueWithAdminDB,
  updateMosqueDB,
  deleteMosqueDB,
  getAllMosquesDB,
  getMosqueByIdDB,
};
