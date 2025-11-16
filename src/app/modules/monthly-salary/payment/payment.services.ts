// import prisma from "../../../utils/prisma";
// import { TPayment } from "./payment.interface";

// const createPaymentDb = async (payload: TPayment) => {
//   try {
//     // Check member exists
//     const member = await prisma.member.findUnique({
//       where: { id: payload.memberId },
//     });

//     if (!member) {
//       throw new Error("Member not found");
//     }

//     // Find all payments for this month
//     const payments = await prisma.payment.findMany({
//       where: { memberId: payload.memberId, monthKey: payload.monthKey },
//     });

//     const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

//     if (totalPaid >= member.monthlyAmount) {
//       throw new Error("This month is already fully paid");
//     }

//     if (totalPaid + payload.amount > member.monthlyAmount) {
//       const remaining = member.monthlyAmount - totalPaid;
//       throw new Error(
//         `Payment exceeded! You can pay only remaining: ${remaining} ৳ for this month`
//       );
//     }

//     const result = await prisma.payment.create({
//       data: {
//         memberId: payload.memberId,
//         monthKey: payload.monthKey,
//         monthName: payload.monthName,
//         amount: payload.amount,
//         userId: payload.userId,
//       },
//       include: { member: true },
//     });

//     return result;
//   } catch (error: any) {
//     throw new Error(error.message || "Failed to create payment");
//   }
// };

// const getMonthlyPayments = async (monthKey: string) => {
//   return await prisma.payment.findMany({
//     where: { monthKey },
//     include: { member: true },
//   });
// };

// const getMemberPaymentSummary = async (memberId: string) => {
//   // Member info
//   const member = await prisma.member.findUnique({
//     where: { id: memberId },
//   });

//   if (!member) throw new Error("Member not found!");

//   const monthlyAmount = member.monthlyAmount;

//   // Total payments count
//   const payments = await prisma.payment.findMany({
//     where: { memberId },
//   });

//   const totalPaidMonths = payments.length;
//   const totalPaidAmount = totalPaidMonths * monthlyAmount;

//   // Assuming member joined from a specific month (example: createdAt month)
//   const startMonth = new Date(member.createdAt);
//   const now = new Date();
//   const monthsActive =
//     (now.getFullYear() - startMonth.getFullYear()) * 12 +
//     (now.getMonth() - startMonth.getMonth()) +
//     1;

//   const dueMonths = monthsActive - totalPaidMonths;
//   const dueAmount = dueMonths * monthlyAmount;

//   return {
//     member,
//     monthlyAmount,
//     totalPaidMonths,
//     totalPaidAmount,
//     dueMonths,
//     dueAmount,
//   };
// };

// const updatePaymentDB = async (id: string, payload: Partial<TPayment>) => {
//   return await prisma.payment.update({
//     where: { id },
//     data: payload,
//   });
// };

// const deletePaymentDB = async (id: string) => {
//   return await prisma.payment.delete({
//     where: { id },
//   });
// };

// export const paymentService = {
//   create: createPaymentDb,
//   getMonthlyPayments,
//   updatePaymentDB,
//   deletePaymentDB,
//   getMemberPaymentSummary,
// };



import prisma from "../../../utils/prisma";
import { TPayment } from "./payment.interface";

// Helper: Generate all months from member creation to now
const generateMonthKeys = (startDate: Date, endDate: Date = new Date()): string[] => {
  const months: string[] = [];
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  while (current <= end) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    months.push(`${year}-${month}`);
    current.setMonth(current.getMonth() + 1);
  }

  return months;
};

// Helper: Get month name from monthKey
const getMonthName = (monthKey: string): string => {
  const [year, month] = monthKey.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

const createPaymentDb = async (payload: TPayment) => {
  try {
    // 1. Check if member exists
    const member = await prisma.member.findUnique({
      where: { id: payload.memberId },
      include: {
        payments: {
          orderBy: { monthKey: 'asc' }
        }
      }
    });

    if (!member) {
      throw new Error("Member not found");
    }

    // 2. Generate all required months from member creation
    const allMonthKeys = generateMonthKeys(member.createdAt);
    
    // 3. Get already paid months
    const paidMonthsSet = new Set(member.payments.map(p => p.monthKey));

    // 4. Find first unpaid month
    const unpaidMonths = allMonthKeys.filter(mk => !paidMonthsSet.has(mk));
    
    if (unpaidMonths.length === 0) {
      throw new Error("All months are already paid!");
    }

    const firstUnpaidMonth = unpaidMonths[0];

    // 5. Check if trying to pay a future month before clearing dues
    if (payload.monthKey !== firstUnpaidMonth) {
      throw new Error(
        `You must pay the oldest unpaid month first: ${getMonthName(firstUnpaidMonth)}. ` +
        `You are trying to pay: ${getMonthName(payload.monthKey)}`
      );
    }

    // 6. Check for existing partial payments in this month
    const existingPayments = await prisma.payment.findMany({
      where: { 
        memberId: payload.memberId, 
        monthKey: payload.monthKey 
      },
    });

    const totalPaid = existingPayments.reduce((sum, p) => sum + p.amount, 0);

    // 7. Validate payment amount
    if (totalPaid >= member.monthlyAmount) {
      throw new Error("This month is already fully paid");
    }

    const remaining = member.monthlyAmount - totalPaid;
    
    if (payload.amount > remaining) {
      throw new Error(
        `Payment exceeded! Remaining amount for ${getMonthName(payload.monthKey)}: ${remaining} ৳`
      );
    }

    // 8. Create payment
    const result = await prisma.payment.create({
      data: {
        memberId: payload.memberId,
        monthKey: payload.monthKey,
        monthName: payload.monthName || getMonthName(payload.monthKey),
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

const getMonthlyPayments = async (monthKey: string, userId: string) => {
  return await prisma.payment.findMany({
    where: { 
      monthKey,
      userId 
    },
    include: { 
      member: {
        select: {
          id: true,
          name: true,
          phone: true,
          monthlyAmount: true
        }
      } 
    },
    orderBy: { paidDate: 'desc' }
  });
};

const getMemberPaymentSummary = async (memberId: string) => {
  // Get member with all payments
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    include: {
      payments: {
        orderBy: { monthKey: 'asc' }
      }
    }
  });

  if (!member) throw new Error("Member not found!");

  const monthlyAmount = member.monthlyAmount;

  // Generate all months member should have paid
  const allMonthKeys = generateMonthKeys(member.createdAt);
  
  // Get paid months with amounts
  const paidMonthsMap = new Map<string, number>();
  member.payments.forEach(payment => {
    const currentTotal = paidMonthsMap.get(payment.monthKey) || 0;
    paidMonthsMap.set(payment.monthKey, currentTotal + payment.amount);
  });

  // Identify fully paid, partially paid, and unpaid months
  const fullyPaidMonths: string[] = [];
  const partiallyPaidMonths: Array<{ monthKey: string; paid: number; remaining: number }> = [];
  const unpaidMonths: string[] = [];

  allMonthKeys.forEach(monthKey => {
    const paidAmount = paidMonthsMap.get(monthKey) || 0;
    
    if (paidAmount >= monthlyAmount) {
      fullyPaidMonths.push(monthKey);
    } else if (paidAmount > 0) {
      partiallyPaidMonths.push({
        monthKey,
        paid: paidAmount,
        remaining: monthlyAmount - paidAmount
      });
    } else {
      unpaidMonths.push(monthKey);
    }
  });

  // Calculate totals
  const totalPaidMonths = fullyPaidMonths.length;
  const totalPaidAmount = fullyPaidMonths.length * monthlyAmount + 
    partiallyPaidMonths.reduce((sum, m) => sum + m.paid, 0);
  
  const totalDueMonths = unpaidMonths.length;
  const totalDueAmount = unpaidMonths.length * monthlyAmount + 
    partiallyPaidMonths.reduce((sum, m) => sum + m.remaining, 0);

  // Next payment info
  const nextPaymentMonth = unpaidMonths.length > 0 ? unpaidMonths[0] : 
    (partiallyPaidMonths.length > 0 ? partiallyPaidMonths[0].monthKey : null);

  return {
    member: {
      id: member.id,
      name: member.name,
      phone: member.phone,
      address: member.address,
      monthlyAmount: member.monthlyAmount,
      joinedDate: member.createdAt
    },
    summary: {
      totalMonthsActive: allMonthKeys.length,
      totalPaidMonths,
      totalPaidAmount,
      totalDueMonths,
      totalDueAmount,
    },
    details: {
      fullyPaidMonths: fullyPaidMonths.map(mk => ({
        monthKey: mk,
        monthName: getMonthName(mk),
        amount: monthlyAmount
      })),
      partiallyPaidMonths: partiallyPaidMonths.map(m => ({
        monthKey: m.monthKey,
        monthName: getMonthName(m.monthKey),
        paidAmount: m.paid,
        remainingAmount: m.remaining
      })),
      unpaidMonths: unpaidMonths.map(mk => ({
        monthKey: mk,
        monthName: getMonthName(mk),
        amount: monthlyAmount
      }))
    },
    nextPayment: nextPaymentMonth ? {
      monthKey: nextPaymentMonth,
      monthName: getMonthName(nextPaymentMonth),
      amount: partiallyPaidMonths.find(m => m.monthKey === nextPaymentMonth)?.remaining || monthlyAmount
    } : null
  };
};

const updatePaymentDB = async (id: string, payload: Partial<TPayment>) => {
  // Prevent changing critical fields
  const { memberId, monthKey, userId, ...updateData } = payload;
  
  return await prisma.payment.update({
    where: { id },
    data: updateData,
    include: { member: true }
  });
};

const deletePaymentDB = async (id: string) => {
  return await prisma.payment.delete({
    where: { id },
    include: { member: true }
  });
};

// Get all members with their payment status
const getAllMembersWithStatus = async (userId: string) => {
  const members = await prisma.member.findMany({
    where: { userId },
    include: {
      payments: {
        orderBy: { monthKey: 'asc' }
      }
    }
  });

  return members.map(member => {
    const allMonthKeys = generateMonthKeys(member.createdAt);
    const paidMonthsSet = new Set(member.payments.map(p => p.monthKey));
    const unpaidCount = allMonthKeys.filter(mk => !paidMonthsSet.has(mk)).length;

    return {
      id: member.id,
      name: member.name,
      phone: member.phone,
      monthlyAmount: member.monthlyAmount,
      totalMonths: allMonthKeys.length,
      paidMonths: paidMonthsSet.size,
      dueMonths: unpaidCount,
      dueAmount: unpaidCount * member.monthlyAmount,
      status: unpaidCount === 0 ? 'paid' : 'due'
    };
  });
};

export const paymentService = {
  create: createPaymentDb,
  getMonthlyPayments,
  updatePaymentDB,
  deletePaymentDB,
  getMemberPaymentSummary,
  getAllMembersWithStatus
};