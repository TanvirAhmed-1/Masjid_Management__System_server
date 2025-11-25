// src/modules/payment/payment.service.ts
import prisma from "../../../utils/prisma";
import { TCreatePayment, TMemberPaymentSummary } from "./payment.interface";

class PaymentService {
  // Add a payment
  async createPayment(payload: TCreatePayment & { userId: string }) {
    const { memberId, monthKey, amount, userId } = payload;

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });
    if (!member) throw new Error("Member not found");

 
    const alreadyPaid = await prisma.payment.findUnique({
      where: {
        memberId_monthKey: { memberId, monthKey },
      },
    });
    if (alreadyPaid) {
      throw new Error(`Payment for ${monthKey} has already been made`);
    }

    return await prisma.payment.create({
      data: {
        memberId,
        monthKey,
        amount,
        userId,
      },
      include: {
        member: {
          select: { name: true, phone: true, monthlyAmount: true },
        },
      },
    });
  }

  async getMemberPaymentSummary(memberId: string): Promise<TMemberPaymentSummary> {
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        payments: {
          orderBy: { monthKey: "desc" },
        },
      },
    });

    if (!member) throw new Error("Member not found");

    const now = new Date();
    const joinYear = member.createdAt.getFullYear();
    const joinMonth = member.createdAt.getMonth(); // 0-indexed
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const totalMonthsShouldPay =
      (currentYear - joinYear) * 12 + (currentMonth - joinMonth) + 1;

    const paidMonths = member.payments.length;
    const dueMonths = totalMonthsShouldPay - paidMonths;
    const totalDue = dueMonths * member.monthlyAmount;

    const paidMonthKeys = member.payments.map((p) => p.monthKey);

    return {
      member: {
        id: member.id,
        name: member.name,
        phone: member.phone,
        monthlyAmount: member.monthlyAmount,
        joinDate: member.createdAt,
      },
      totalMonthsShouldPay,
      paidMonths,
      dueMonths,
      totalDue,
      paidMonthKeys,
      payments: member.payments as any,
    };
  }


  async getMonthlyCollection(monthKey: string) {
    const payments = await prisma.payment.findMany({
      where: { monthKey },
      include: {
        member: {
          select: { name: true, phone: true, monthlyAmount: true },
        },
      },
      orderBy: { paidDate: "desc" },
    });

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    return {
      monthKey,
      totalMembersPaid: payments.length,
      totalAmount,
      payments,
    };
  }

  // সব পেমেন্ট (admin dashboard এর জন্য)
  async getAllPayments() {
    return await prisma.payment.findMany({
      include: {
        member: { select: { name: true, phone: true } },
        user: { select: { name: true } },
      },
      orderBy: { paidDate: "desc" },
    });
  }
}

export const paymentService = new PaymentService();