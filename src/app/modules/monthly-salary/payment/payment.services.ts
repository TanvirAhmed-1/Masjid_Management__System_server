// src/modules/payment/payment.service.ts
import prisma from "../../../utils/prisma";
import { TCreatePayment, TMemberPaymentSummary } from "./payment.interface";

class PaymentService {
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

  async getYearlyCollection({
    year,
    mosqueId,
    page,
    limit,
  }: {
    year: string;
    mosqueId?: string;
    page?: number;
    limit?: number;
  }) {
    if (!mosqueId) throw new Error("Mosque ID is required");
    if (!year) throw new Error("Year is required");

    const safePage = Number(page) > 0 ? Number(page) : 1;
    const safeLimit = Number(limit) > 0 ? Number(limit) : 10;

    const skip = (safePage - 1) * safeLimit;
    const take = safeLimit;

    const total = await prisma.member.count({
      where: { mosqueId },
    });

    const members = await prisma.member.findMany({
      where: { mosqueId },
      skip,
      take,
      select: {
        id: true,
        name: true,
        phone: true,
        monthlyAmount: true,
        payments: {
          where: {
            monthKey: {
              startsWith: year,
            },
          },
          select: {
            id: true,
            monthKey: true,
            amount: true,
            paidDate: true,
          },
          orderBy: {
            monthKey: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPage: Math.ceil(total / safeLimit),
      },
      result: members,
    };
  }

  async deletePaymentBD(paymentId: string, mosqueId?: string) {
    if (!paymentId) {
      throw new Error("Payment ID is required");
    }
    if (!mosqueId) {
      throw new Error("Mosque ID is required");
    }
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        mosqueId,
      },
    });

    if (!payment) throw new Error("Payment not found");

    return await prisma.payment.delete({ where: { id: paymentId } });
  }

  async updatePaymentDB({
    id,
    mosqueId,
    data,
  }: {
    id: string;
    mosqueId?: string;
    data: {
      memberId?: string;
      monthKey?: string;
      amount?: number;
    };
  }) {
    if (!id) throw new Error("Payment ID is required");
    if (!mosqueId) throw new Error("Mosque ID is required");

    const existingPayment = await prisma.payment.findFirst({
      where: {
        id,
        mosqueId,
      },
    });

    if (!existingPayment) {
      throw new Error("Payment not found");
    }

    if (data.memberId && data.monthKey) {
      const duplicate = await prisma.payment.findFirst({
        where: {
          mosqueId,
          memberId: data.memberId,
          monthKey: data.monthKey,
          NOT: { id },
        },
      });

      if (duplicate) {
        throw new Error(
          `Payment for ${data.monthKey} already exists for this member`,
        );
      }
    }

    return await prisma.payment.update({
      where: { id },
      data: {
        ...(data.memberId && { memberId: data.memberId }),
        ...(data.monthKey && { monthKey: data.monthKey }),
        ...(data.amount !== undefined && { amount: data.amount }),
      },
    });
  }

  async getAllPayments(query: any) {
    const {
      mosqueId,
      limit = 20,
      page = 1,
      sortBy = "createdAt",
      sortOrder,
      name,
      phone,
      form,
      to,
      monthKey,
    } = query;
    if (!mosqueId) {
      throw new Error("Mosque ID is required");
    }
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const whereCondition: any = { mosqueId };

    if (monthKey) {
      whereCondition.monthKey = monthKey;
    }
    if (name) {
      whereCondition.member = { name: { contains: name, mode: "insensitive" } };
    }
    if (phone) {
      whereCondition.member = {
        phone: { contains: phone, mode: "insensitive" },
      };
    }
    if (form && to) {
      whereCondition.paidDate = {
        gte: new Date(form),
        lte: new Date(to),
      };
    }

    const result = await prisma.payment.findMany({
      where: whereCondition,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      include: {
        member: {
          select: { name: true, phone: true, monthlyAmount: true, id: true },
        },
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
  }
}

export const paymentService = new PaymentService();
