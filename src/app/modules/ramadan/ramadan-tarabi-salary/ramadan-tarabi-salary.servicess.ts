import prisma from "../../../utils/prisma";
import { IRamadanTarabiPayment } from "./ramadan-tarabi-salary.interface";

const createPaymentDB = async (payload: IRamadanTarabiPayment) => {
  return await prisma.ramadanTarabiPayment.create({
    data: payload,
  });
};

const getAllPaymentsDB = async (query: any) => {
  const {
    ramadanYearId,
    memberId,
    form,
    to,
    limit = 20,
    page = 1,
    sortBy = "createdAt",
    sortOrder = "desc",
    mosqueId,
  } = query;

  if (!mosqueId) {
    throw new Error("Mosque ID is required");
  }

  // 1. Setup Pagination values
  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.max(Number(limit), 1);
  const skip = (pageNumber - 1) * limitNumber;

  // 2. Build where conditions
  const whereCondition: any = {
    mosqueId,
  };

  if (ramadanYearId) whereCondition.ramadanYearId = ramadanYearId;
  if (memberId) whereCondition.memberId = memberId;

  // Date Range Filtering
  if (form || to) {
    whereCondition.payDate = {};
    if (form) whereCondition.payDate.gte = new Date(form);
    if (to) whereCondition.payDate.lte = new Date(to);
  }

  // 3. Execute count and findMany in parallel for better performance
  const [data, total] = await Promise.all([
    prisma.ramadanTarabiPayment.findMany({
      where: whereCondition,
      include: {
        member: true,
        ramadanYear: true,
      },
      skip,
      take: limitNumber,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.ramadanTarabiPayment.count({
      where: whereCondition,
    }),
  ]);

  // 4. Return the structure matching your frontend's expected JSON
  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber),
    },
    data,
  };
};
const getPaymentByIdDB = async (id: string) => {
  return await prisma.ramadanTarabiPayment.findUnique({
    where: { id },
    include: { member: true, ramadanYear: true },
  });
};

const updatePaymentDB = async (
  id: string,
  payload: Partial<IRamadanTarabiPayment>,
) => {
  const existingPayment = await prisma.ramadanTarabiPayment.findUnique({
    where: { id },
  });
  if (!existingPayment) throw new Error("Payment not found");
  
  return await prisma.ramadanTarabiPayment.update({
    where: { id },
    data: payload,
  });
};

const deletePaymentDB = async (id: string) => {
  return await prisma.ramadanTarabiPayment.delete({
    where: { id },
  });
};

export const RamadanTarabiPaymentService = {
  createPaymentDB,
  getAllPaymentsDB,
  getPaymentByIdDB,
  updatePaymentDB,
  deletePaymentDB,
};
