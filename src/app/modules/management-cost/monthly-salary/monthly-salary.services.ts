import prisma from "../../../utils/prisma";
import { IMonthlySalary } from "./monthly-salary.interface";

const createMonthlySalary = async (
  data: IMonthlySalary,
  userId?: string,
  mosqueId?: string,
) => {
  if (!mosqueId) {
    throw new Error("Mosque ID is required");
  }
  if (!userId) {
    throw new Error("User ID is required");
  }
  if (!data.staffId) {
    throw new Error("Staff ID is required");
  }

  const result = await prisma.monthlySalary.create({
    data: {
      month: new Date(data.month),
      totalSalary: data.totalSalary,
      staff: {
        connect: {
          id: data.staffId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },

      mosque: {
        connect: {
          id: mosqueId,
        },
      },
    },
    include: {
      staff: true,
      payments: true,
    },
  });

  return result;
};

const getAllMonthlySalaries = async (query: any) => {
  const {
    mosqueId,
    page = 1,
    limit = 20,
    orderBy = "desc",
    sortBy = "createdAt",
    name,
    phone,
    active,
  } = query;
  if (!mosqueId) throw new Error("Mosque ID is required");

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const whereCondition: any = { mosqueId };
  if (name) {
    whereCondition.name = { contains: name, mode: "insensitive" };
  }
  if (phone) {
    whereCondition.phone = { contains: phone, mode: "insensitive" };
  }
  if (active) {
    whereCondition.active = active;
  }

  const result = await prisma.monthlySalary.findMany({
    where: whereCondition,
    skip,
    take,
    orderBy: {
      [sortBy]: orderBy,
    },
    include: {
      staff: true,
      payments: true,
    },
  });

  const total = await prisma.monthlySalary.count({
    where: whereCondition,
  });

  return {
    meta: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    },
    data: result,
  };
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
