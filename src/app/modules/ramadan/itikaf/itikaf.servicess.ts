import prisma from "../../../utils/prisma";
import { ItikaInterface } from "./itikaf.interface";

const createItikaDB = async (payload: ItikaInterface) => {
  const result = await prisma.ifikafList.create({
    data: payload,
  });
  return result;
};

const getAllItikaDB = async () => {
  const result = await prisma.ifikafList.findMany();
  return result;
};

const getSingleItikaDB = async (id: string) => {
  const result = await prisma.ifikafList.findUnique({
    where: { id },
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
