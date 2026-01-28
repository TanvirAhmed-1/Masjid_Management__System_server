// src/modules/payment/payment.service.ts
import prisma from "../../../utils/prisma";
import { TCreatePayment, TMemberPaymentSummary } from "./payment.interface";

class PaymentService {
  // Add a payment
  async createPayment(payload: TCreatePayment & { userId: string }) {
    const { mosqueId, userId, memberId } = payload;
    if (!userId) {
      throw new Error("User ID is required");
    }
    if (!mosqueId) {
      throw new Error("Mosque ID is required");
    }
    const { monthKey, amount } = payload;

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });
    if (!member) throw new Error("Member not found");

    const alreadyPaid = await prisma.payment.findUnique({
      where: {
        mosqueId,
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
        mosqueId,
      },
      include: {
        member: {
          select: { name: true, phone: true, monthlyAmount: true },
        },
      },
    });
  }

  async getMemberPaymentSummary({
    memberId,
    mosqueId,
  }: {
    memberId: string;
    mosqueId?: string;
  }): Promise<TMemberPaymentSummary> {
    if (!memberId) throw new Error("Member ID is required");
    if (!mosqueId) throw new Error("Mosque ID is required");
    const member = await prisma.member.findUnique({
      where: { id: memberId, mosqueId: mosqueId },
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

  async getMonthlyCollection({
    monthKey,
    mosqueId,
  }: {
    monthKey: string;
    mosqueId?: string;
  }) {
    if (!mosqueId) throw new Error("Mosque ID is required");
    if (!monthKey) throw new Error("Month key is required");

    const payments = await prisma.payment.findMany({
      where: {
        monthKey,
        member: {
          mosqueId,
        },
      },
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

  async deletePaymentBD(paymentId: string) {
    if (!paymentId) {
      throw new Error("Payment ID is required");
    }
    return await prisma.payment.delete({ where: { id: paymentId } });
  }
  async getAllPayments(query: any) {
    const {
      mosqueId,
      limit = 20,
      page = 1,
      sortBy = "createdAt",
      sortOrder,
    } = query;
    if (!mosqueId) {
      throw new Error("Mosque ID is required");
    }
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const whereCondition: any = { mosqueId };
    const result = await prisma.payment.findMany({
      where: whereCondition,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      include: {
        member: { select: { name: true, phone: true } },
        user: { select: { name: true } },
      },
    });
    const total = await prisma.payment.count({ where: whereCondition });

    return {
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / Number(limit)),
      },
      data: result,
    };

    // return await prisma.payment.findMany({
    //   include: {
    //     member: { select: { name: true, phone: true } },
    //     user: { select: { name: true } },
    //   },
    //   orderBy: { paidDate: "desc" },
    // });
  }
}

export const paymentService = new PaymentService();
