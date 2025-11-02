import prisma from "../../../utils/prisma";
import { TPayment } from "./payment.interface";

const createPaymentDb = async (payload: TPayment) => {
  try {
    // Check member exists
    const member = await prisma.member.findUnique({
      where: { id: payload.memberId },
    });

    if (!member) {
      throw new Error("Member not found");
    }

    // Find all payments for this month
    const payments = await prisma.payment.findMany({
      where: { memberId: payload.memberId, monthKey: payload.monthKey },
    });

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    if (totalPaid >= member.monthlyAmount) {
      throw new Error("This month is already fully paid");
    }

    if (totalPaid + payload.amount > member.monthlyAmount) {
      const remaining = member.monthlyAmount - totalPaid;
      throw new Error(
        `Payment exceeded! You can pay only remaining: ${remaining} ৳ for this month`
      );
    }

    const result = await prisma.payment.create({
      data: {
        memberId: payload.memberId,
        monthKey: payload.monthKey,
        monthName: payload.monthName,
        amount: payload.amount,
        userId: payload.userId,
      },
      include: { member: true },
    });

    return result;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create payment");
  }
};

const getMonthlyPayments = async (monthKey: string) => {
  return await prisma.payment.findMany({
    where: { monthKey },
    include: { member: true },
  });
};

const getMemberPaymentSummary = async (memberId: string) => {
  // Member info
  const member = await prisma.member.findUnique({
    where: { id: memberId },
  });

  if (!member) throw new Error("Member not found!");

  const monthlyAmount = member.monthlyAmount;

  // Total payments count
  const payments = await prisma.payment.findMany({
    where: { memberId },
  });

  const totalPaidMonths = payments.length;
  const totalPaidAmount = totalPaidMonths * monthlyAmount;

  // Assuming member joined from a specific month (example: createdAt month)
  const startMonth = new Date(member.createdAt);
  const now = new Date();
  const monthsActive =
    (now.getFullYear() - startMonth.getFullYear()) * 12 +
    (now.getMonth() - startMonth.getMonth()) +
    1;

  const dueMonths = monthsActive - totalPaidMonths;
  const dueAmount = dueMonths * monthlyAmount;

  return {
    member,
    monthlyAmount,
    totalPaidMonths,
    totalPaidAmount,
    dueMonths,
    dueAmount,
  };
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
  getMemberPaymentSummary,
};
