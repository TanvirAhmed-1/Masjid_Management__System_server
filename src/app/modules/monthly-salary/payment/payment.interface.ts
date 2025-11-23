// src/modules/payment/payment.interface.ts

export type TCreatePayment = {
  memberId: string;
  monthKey: string;     // "2025-01"
  amount: number;
};

export type TPayment = TCreatePayment & {
  id: string;
  paidDate: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  member: {
    name: string;
    phone?: string | null;
    monthlyAmount: number;
  };
};

export type TMemberPaymentSummary = {
  member: {
    id: string;
    name: string;
    phone?: string | null;
    monthlyAmount: number;
    joinDate: Date;
  };
  totalMonthsShouldPay: number;
  paidMonths: number;
  dueMonths: number;
  totalDue: number;
  paidMonthKeys: string[];
  payments: TPayment[];
};