export interface IRamadanTarabiPayment {
  id?: string;
  amount: number;
  paidAmount: number;
  payDate?: Date;
  ramadanYearId: string;
  memberId: string;
  mosqueId?: string;
  userId: string;
}
