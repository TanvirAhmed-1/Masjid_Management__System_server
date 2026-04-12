export enum DonationPurpose {
  GENERAL = "GENERAL",
  ZAKAT = "ZAKAT",
  SADAQAH = "SADAQAH",
  CONSTRUCTION = "CONSTRUCTION",
  MONTHLY_AMOUNT = "MONTHLY_AMOUNT",
}

export interface OnlineDonationInterface {
  id?: string;
  amount: number;
  donorName?: string;
  donorPhone: string;
  donorDescription?: string;
  purpose: DonationPurpose;
  mosqueId: string;
  trxID: string;
  paymentID: string;
  status?: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
}

export interface BkashCredentialInterface {
  appKey: string;
  appSecret: string;
  username: string;
  password: string;
  isLive: boolean;
  mosqueId: string;
}