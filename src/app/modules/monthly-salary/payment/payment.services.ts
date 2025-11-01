import prisma from "../../../utils/prisma";
import { TPayment } from "./payment.interface";

const createPaymentDb = async (payload: TPayment) => {
  try {
    const already = await prisma.payment.findFirst({
      where: { memberId: payload.memberId, monthKey: payload.monthKey },
    });

    if (already) {
      throw new Error("This member already paid for this month");
    }

    return await prisma.payment.create({
      data: payload,
      include: { member: true },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("This member already paid for this month");
    }
    throw error;
  }
};


const getMonthlyPayments = async (monthKey: string) => {
  return await prisma.payment.findMany({
    where: { monthKey },
    include: { member: true },
  });
};

const updatePaymentDB = async (id: string, payload: Partial<TPayment>) => {
  return await prisma.payment.update({
    where: { id },
    data: payload,
  });
};

const deletePaymentDB = async (id: string) => {
  return await prisma.payment.delete({
    where: { id },
  });
};

export const paymentService = {
  create: createPaymentDb,
  getMonthlyPayments,
  updatePaymentDB,
  deletePaymentDB,
};
