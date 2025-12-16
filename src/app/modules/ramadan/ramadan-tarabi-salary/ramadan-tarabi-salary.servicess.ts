import prisma from "../../../utils/prisma";
import {
  IRamadanIftarSalaryPayment,
  IRamadanIftarSalary,
} from "./ramadan-tarabi-salary.interface";

// Ramadan Iftar Salary Service

const createSalary = async (payload: IRamadanIftarSalary) => {
  const salary = await prisma.ramadantarabiSalary.create({
    data: {
      ramadanYear: payload.ramadanYear,
      totalSalary: payload.totalSalary,
      userId: payload.userId,
    },
  });
  return salary;
};

// Fetch all salaries

const fetchSalaries = async () => {
  const salaries = await prisma.ramadantarabiSalary.findMany({
    include: {
      payments: {
        include: { member: true },
      },
    },
  });
  return salaries;
};

// Fetch salary by ID
const fetchSalaryById = async (salaryId: string) => {
  const salary = await prisma.ramadantarabiSalary.findUnique({
    where: { id: salaryId },
    include: {
      payments: {
        include: { member: true },
      },
    },
  });
  return salary;
};

// add a payment
const addPayment = async (payload: IRamadanIftarSalaryPayment) => {
  const payment = await prisma.ramadantarabiSalaryPayment.create({
    data: {
      amount: payload.amount,
      salaryId: payload.salaryId,
      memberId: payload.memberId,
      userId: payload.userId,
    },
  });
  return payment;
};

// Update a payment

const updatePayment = async (paymentId: string, amount: number) => {
  const payment = await prisma.ramadantarabiSalaryPayment.update({
    where: { id: paymentId },
    data: { amount },
  });
  return payment;
};

// Delete a payment

const deletePayment = async (paymentId: string) => {
  const payment = await prisma.ramadantarabiSalaryPayment.delete({
    where: { id: paymentId },
  });
  return payment;
};

// Get Member Payment Summary (total paid, remaining)

const getMemberPaymentStatus = async (salaryId: string) => {
  const salary = await prisma.ramadantarabiSalary.findUnique({
    where: { id: salaryId },
    include: {
      user: {
        include: { members: true },
      },
      payments: true,
    },
  });

  if (!salary) throw new Error("Salary not found");

  const members = salary.user.members;

  const result = members.map((member) => {
    const memberPayments = salary.payments.filter(
      (p) => p.memberId === member.id
    );
    const totalPaid = memberPayments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = member.monthlyAmount - totalPaid;

    return {
      memberId: member.id,
      memberName: member.name,
      totalAmount: member.monthlyAmount,
      totalPaid,
      remaining,
      payments: memberPayments.map((p) => ({
        paymentId: p.id,
        amount: p.amount,
        payDate: p.payDate,
      })),
    };
  });

  return result;
};

export const RamadanIftarSalaryService = {
  createSalary,
  fetchSalaries,
  fetchSalaryById,
  addPayment,
  updatePayment,
  deletePayment,
  getMemberPaymentStatus,
};
