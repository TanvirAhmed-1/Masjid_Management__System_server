import prisma from "../../../utils/prisma";
import { ISalaryPayment } from "./staff-salary-payment.interface";

const createSalaryPaymentDB = async (payload: ISalaryPayment) => {
  const { salaryId, userId, mosqueId } = payload;
  if (!salaryId) throw new Error("Salary ID is required");
  if (!userId) throw new Error("User ID is required");
  if (!mosqueId) throw new Error("Mosque ID is required");
  const isExisting = await prisma.staff.findFirst({
    where: {
      id: salaryId,
    },
  });
  if (!isExisting) {
    throw new Error("Salary Payment already exists for this salary");
  }
  return await prisma.salaryPayment.create({ data: payload });
};

const getAllSalaryPaymentDB = async (query: any) => {
  const {
    mosqueId,
    limit = 20,
    page = 1,
    sortBy = "createdAt",
    sortOrder = "desc",
    name,
    phone,
    fromDate,
    toDate,
  } = query;
  if (!mosqueId) throw new Error("Mosque ID is required");
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const whereCondition: any = { mosqueId };
  if (name) {
    whereCondition.staff = {
      name: {
        contains: name,
        mode: "insensitive",
      },
    };
  }
  if (phone) {
    whereCondition.staff = {
      phone: {
        contains: phone,
        mode: "insensitive",
      },
    };
  }
  if (fromDate && toDate) {
    whereCondition.paidDate = {
      gte: new Date(fromDate),
      lte: new Date(toDate),
    };
  }
  const result = await prisma.salaryPayment.findMany({
    where: whereCondition,
    skip,
    take,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      staff: true,
    },
  });
  const total = await prisma.salaryPayment.count({ where: whereCondition });
  return {
    meta: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / Number(limit)),
    },
    data: result,
  };
};

const updateSalaryPaymentDB = async (
  id: string,
  payload: Partial<ISalaryPayment>,
) => {
  if (!id) throw new Error("Id is required");
  return await prisma.salaryPayment.update({
    where: { id },
    data: payload,
  });
};

const deleteSalaryPaymentDB = async (id: string) => {
  if (!id) throw new Error("Id is required");
  const payment = await prisma.salaryPayment.findUnique({ where: { id } });
  if (!payment) throw new Error("Salary Payment not found");

  return await prisma.salaryPayment.delete({ where: { id } });
};

export const staffSalaryPaymentServices = {
  createSalaryPaymentDB,
  updateSalaryPaymentDB,
  getAllSalaryPaymentDB,
  deleteSalaryPaymentDB,
};
