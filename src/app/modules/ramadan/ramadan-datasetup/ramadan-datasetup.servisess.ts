import prisma from "../../../utils/prisma";
import { RamadanYearInterface } from "./ramadan-datasetup.interface";

const createrRamadanDataSetupDB = async (payload: RamadanYearInterface) => {
 return await prisma.ramadanYear.create({
    data: payload,
  });
};

const fetchRamadanDataDB = async () => {
  return await prisma.ramadanYear.findMany({});
};

const updateRamadanDataSetupBD = async (
  ramadanyearId: string,
  payload: Partial<RamadanYearInterface>
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
    where: { id: ramadanyearId }
  });
};

export const dateSetUpServicess = {
  deleteRamadanDataSetupBD,
  updateRamadanDataSetupBD,
  fetchRamadanDataDB,
  createrRamadanDataSetupDB,
};
