import prisma from "../../../utils/prisma";
import { IMemberAccessoryPurchase } from "./management-purchase.interface";

const createPurchaseDB = async (payload: IMemberAccessoryPurchase) => {
  return await prisma.memberAccessoryPurchase.create({
    data: payload,
  });
};

const fetchAllPurchasesDB = async () => {
  return await prisma.memberAccessoryPurchase.findMany({
    include: {
      user: true,
    },
  });
};

const fetchPurchaseByIdDB = async (id: string) => {
  return await prisma.memberAccessoryPurchase.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });
};

const updatePurchaseDB = async (
  id: string,
  payload: Partial<IMemberAccessoryPurchase>
) => {
  const existing = await prisma.memberAccessoryPurchase.findUnique({
    where: { id },
  });
  if (!existing) throw new Error("Purchase not found");
  return await prisma.memberAccessoryPurchase.update({
    where: { id },
    data: payload,
  });
};

const deletePurchaseDB = async (id: string) => {
  const existing = await prisma.memberAccessoryPurchase.findUnique({
    where: { id },
  });
  if (!existing) throw new Error("Purchase not found");
  return await prisma.memberAccessoryPurchase.delete({ where: { id } });
};

export const MemberAccessoryPurchaseService = {
  createPurchaseDB,
  fetchAllPurchasesDB,
  fetchPurchaseByIdDB,
  updatePurchaseDB,
  deletePurchaseDB,
};
