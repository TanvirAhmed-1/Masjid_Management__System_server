import prisma from "../../../utils/prisma";
import { IMonthlySalary } from "./monthly-salary.interface";

const createMonthlySalary = async (data: IMonthlySalary) => {
  const result = await prisma.monthlySalary.create({
    data,
    include: {
      staff: true,
      user: true,
      payments: true,
    },
  });

  return result;
};

const getAllMonthlySalaries = async () => {
  return await prisma.monthlySalary.findMany({
    include: {
      staff: true,
      user: true,
      payments: true,
    },
  });
};

const getMonthlySalaryById = async (salaryId: string) => {
  return await prisma.monthlySalary.findUnique({
    where: { id: salaryId },
    include: {
      staff: true,
      user: true,
      payments: true,
    },
  });
};

const updateMonthlySalary = async (salaryId: string, data: IMonthlySalary) => {
  return await prisma.monthlySalary.update({
    where: { id: salaryId },
    data,
  });
};
const deleteMonthlySalary = async (salaryId: string) => {
  const salary = await prisma.monthlySalary.findUnique({
    where: { id: salaryId },
  });
  if (!salary) throw new Error("Monthly Salary not found");

  return await prisma.monthlySalary.delete({ where: { id: salaryId } });
};

export const monthlySalaryServices = {
  createMonthlySalary,
  getAllMonthlySalaries,
  getMonthlySalaryById,
  updateMonthlySalary,
  deleteMonthlySalary,
};
