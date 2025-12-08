import prisma from "../../../utils/prisma";
import { IStaff } from "./satff.interface";

const createstffDB = async (payload: IStaff) => {
  return await prisma.staff.create({
    data: payload,
  });
};

const getAllstaffDB = async () => {
  return await prisma.staff.findMany();
};

const getstaffByIdDB = async (id: string) => {
  return await prisma.staff.findUnique({
    where: { id },
  });
};
const updatestaffDB = async (id: string, payload: Partial<IStaff>) => {
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