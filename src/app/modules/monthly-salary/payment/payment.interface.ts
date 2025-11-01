export type TPayment = {
  id?: string;
  memberId: string;
  monthKey: string;
  monthName: string;
  amount: number;
  paidDate?: string | Date;
  updatedAt?: string | Date;
  userId: string;
};