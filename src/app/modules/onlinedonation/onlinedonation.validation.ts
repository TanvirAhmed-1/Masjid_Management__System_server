import { z } from "zod";

export const bkashCredentialSchema = z.object({
  appKey: z.string().min(1),
  appSecret: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  isLive: z.boolean().default(false),
});

export const donationRequestSchema = z.object({
  amount: z.number().positive(),
  donorName: z.string().optional(),
  donorPhone: z.string().min(11),
  donorDescription: z.string().optional(),
  purpose: z.enum(["GENERAL", "ZAKAT", "SADAQAH", "CONSTRUCTION", "MONTHLY_AMOUNT"]),
});