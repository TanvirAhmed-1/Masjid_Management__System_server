import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { onlineDonationServices } from "./onlinedonation.services";
import prisma from "../../utils/prisma";
import axios from "axios";

const createOnlineDonation = catchAsync(async (req, res) => {
  const { amount, mosqueId, donorPhone, donorName, purpose, donorDescription } = req.body;

  // ১. ক্রেডেনশিয়াল খুঁজে বের করা
  const credentials = await prisma.bkashCredential.findUnique({
    where: { mosqueId },
  });

  if (!credentials) {
    return res.status(404).json({ success: false, message: "Mosque credentials not found!" });
  }

  const { appKey, appSecret, username, password, isLive } = credentials;
  
  // আপনার দেওয়া সঠিক স্যান্ডবক্স ইউআরএল স্ট্রাকচার
  const baseUrl = isLive 
    ? "https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout" 
    : "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout";

  try {
    // ২. Grant Token জেনারেট করা (সঠিক হেডারসহ)
    const { data: tokenData } = await axios.post(
      `${baseUrl}/token/grant`,
      { 
        app_key: appKey, 
        app_secret: appSecret 
      },
      { 
        headers: { 
          username: username, 
          password: password,
          "Content-Type": "application/json",
          "Accept": "application/json"
        } 
      }
    );

    // টোকেন না পেলে এখানেই এরর থ্রো করবে
    if (!tokenData.id_token) {
      throw new Error("bKash Grant Token failed");
    }

    // ৩. Payment Create করা
    const { data: paymentData } = await axios.post(
      `${baseUrl}/create`,
      {
        mode: "0011",
        payerReference: donorPhone || "017XXXXXXXX",
         callbackURL: `${process.env.BACKEND_URL}/api/callback`, 
        // callbackURL: "https://www.google.com", // টেস্টের জন্য গুগল ইউআরএল ব্যবহার করা হচ্ছে
        amount: String(amount), 
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: `INV${Date.now()}`,
      },
      {
        headers: {
          "Authorization": tokenData.id_token, // 'Bearer' দরকার নেই, শুধু টোকেন
          "X-APP-Key": appKey,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      }
    );

    // ৪. পেমেন্ট আইডি চেক করা
    if (!paymentData.paymentID) {
        // bKash থেকে আসা আসল এরর মেসেজ দেখার জন্য
        console.error("bKash Error Response:", paymentData);
        throw new Error(paymentData.errorMessage || "bKash Payment ID not generated");
    }

    // ৫. ডাটাবেসে সেভ (Prisma Schema অনুযায়ী)
    const dbRecord = await onlineDonationServices.createDonationRecordDB({
      amount: parseFloat(amount),
      donorName: donorName || "Anonymous",
      donorPhone: donorPhone,
      donorDescription: donorDescription || "",
      purpose: purpose || "GENERAL",
      mosqueId: mosqueId,
      paymentID: paymentData.paymentID,
      trxID: `PENDING_${paymentData.paymentID}`, // Unique হওয়ার জন্য
      status: "PENDING",
    });

    res.status(200).json({
      success: true,
      message: "Payment initiated",
      result: {
        bkashURL: paymentData.bkashURL,
        ...dbRecord,
      },
    });

  } catch (error: any) {
    // এখানে কনসোলে এররটি প্রিন্ট করুন সমস্যা বোঝার জন্য
    console.error("FINAL BKASH ERROR:", error.response?.data || error.message);
    
    res.status(500).json({ 
      success: false, 
      message: "bKash payment initiation failed",
      errorDetails: error.response?.data || error.message
    });
  }
});

const saveBkashCredentials = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;
  if (!mosqueId) throw new Error("Mosque ID is required");

  const result = await onlineDonationServices.saveBkashCredentialDB({
    ...req.body,
    mosqueId,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "bKash credentials updated successfully",
    result,
  });
});

const getDonationHistory = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;
  const result = await onlineDonationServices.getDonationsDB({
    mosqueId,
    ...req.query,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "Donation records fetched successfully",
    result,
  });
});

const handlePaymentCallback = catchAsync(async (req, res) => {
  const { status, paymentID, trxID } = req.query;
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

  if (status === "success") {
    await onlineDonationServices.updateDonationStatusDB(
      paymentID as string,
      trxID as string,
      "SUCCESS",
    );
    return res.redirect(`${clientUrl}/donation/success?trxID=${trxID}`);
  } else {
    const failStatus = status === "cancel" ? "CANCELLED" : "FAILED";
    await onlineDonationServices.updateDonationStatusDB(
      paymentID as string,
      (trxID as string) || "N/A",
      failStatus,
    );
    return res.redirect(`${clientUrl}/donation/fail`);
  }
});

const getBkashCredentialCollection = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;
  if (!mosqueId) throw new Error("Mosque ID is required");

  const result = await onlineDonationServices.getBkashCredentialDB(mosqueId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "bKash credentials fetched successfully",
    result,
  });
});

export const onlineDonationController = {
  saveBkashCredentials,
  getDonationHistory,
  handlePaymentCallback,
  getBkashCredentialCollection,
  createOnlineDonation, // নতুন যুক্ত হয়েছে
};
