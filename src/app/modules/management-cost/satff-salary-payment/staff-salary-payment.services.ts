import prisma from "../../../utils/prisma";
import { ISalaryPayment } from "./staff-salary-payment.interface";

const createSalaryPaymentDB = async (payload: ISalaryPayment) => {
  return await prisma.salaryPayment.create({ data: payload });
};

const getAllSalaryPaymentDB = async () => {
  return await prisma.salaryPayment.findMany({
    include: {
      salary: true,
      user: {
        select: { name: true },
      },
    },
  });
};

const updateSalaryPaymentDB = async (
  id: string,
  payload: Partial<ISalaryPayment>
) => {
  return await prisma.salaryPayment.update({
    where: { id },
    data: payload,
  });
};

const deleteSalaryPaymentDB = async (id: string) => {
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
