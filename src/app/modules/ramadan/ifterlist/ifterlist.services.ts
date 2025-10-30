import prisma from "../../../utils/prisma";
import { ifterlistinterface } from "./ifterlist.interface";


const createlistDB = async (payload: ifterlistinterface) => {
  return await prisma.ifterList.create({ data: payload });
};

const getifterlistDB = async () => {
  return await prisma.ifterList.findMany();
};

const getSingleItikaDB = async (id: string) => {
  return await prisma.ifterList.findUnique({
    where: { id },
  });
};

const updateifterlistDB = async (
  id: string,
  payload: Partial<ifterlistinterface>
) => {
  return await prisma.ifterList.update({
    where: { id },
    data: payload,
  });
};

const deleteifterlistDB = async (id: string) => {
  return await prisma.ifterList.delete({
    where: { id },
  });
};

export const ifterlistServices = {
  createlistDB,
  getifterlistDB,
  updateifterlistDB,
  deleteifterlistDB,
  getSingleItikaDB,
};
