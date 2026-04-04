export interface IRamadanTarabiPayment {
  id?: string;
  amount: number;
  payDate?: Date;
  ramadanYearId: string;
  memberId: string;
  mosqueId?: string;
  userId: string;
}
