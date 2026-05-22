import prisma from "../../../utils/prisma";
import { IRamadanTarabiPayment } from "./ramadan-tarabi-salary.interface";

const createPaymentDB = async (payload: IRamadanTarabiPayment) => {
  const { ramadanYearId, memberId, mosqueId, paidAmount = 0, amount } = payload;

  const existing = await prisma.ramadanTarabiPayment.findFirst({
    where: {
      ramadanYearId,
      memberId,
      mosqueId,
    },
  });

  // ✅ UPDATE
  if (existing) {
    const totalAmount = existing.amount;
    const currentPaid = existing.paidAmount;
    const newPaidAmount = currentPaid + paidAmount;

    const due = totalAmount - currentPaid;

    // ❌ ONLY greater than (not equal)
    if (paidAmount > due) {
      throw new Error(`You can pay maximum ${due} taka`);
    }

    return await prisma.ramadanTarabiPayment.update({
      where: { id: existing.id },
      data: {
        paidAmount: newPaidAmount,
        payDate: new Date(),
      },
    });
  }
  if (paidAmount > amount) {
    throw new Error("Paid amount cannot be greater than total amount");
  }

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

  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.max(Number(limit), 1);
  const skip = (pageNumber - 1) * limitNumber;

  const whereCondition: any = { mosqueId };

  if (ramadanYearId) whereCondition.ramadanYearId = ramadanYearId;
  if (memberId) whereCondition.memberId = memberId;

  if (form || to) {
    whereCondition.payDate = {};
    if (form) whereCondition.payDate.gte = new Date(form);
    if (to) whereCondition.payDate.lte = new Date(to);
  }

  const [data, total] = await Promise.all([
    prisma.ramadanTarabiPayment.findMany({
      where: whereCondition,
      include: {
        member: true,
        ramadanYear: true,
        mosque: {
          select: { name: true },
        },
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

  const formattedData = data.map((item: any) => ({
    ...item,
    dueAmount: item.amount - item.paidAmount,
  }));

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber),
    },
    data: formattedData,
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
  const existing = await prisma.ramadanTarabiPayment.findUnique({
    where: { id },
  });

  if (!existing) throw new Error("Payment not found");

  const due = existing.amount - existing.paidAmount;
  const incomingPayment = payload.paidAmount || 0;

  if (incomingPayment > due) {
    throw new Error(`You can pay maximum ${due} taka`);
  }

  const newPaidAmount = existing.paidAmount + incomingPayment;

  return await prisma.ramadanTarabiPayment.update({
    where: { id },
    data: {
      paidAmount: newPaidAmount,
      payDate: new Date(),
    },
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
