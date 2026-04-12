import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { onlineDonationServices } from "./onlinedonation.services";
import prisma from "../../utils/prisma";
import axios from "axios";

// ১. পেমেন্ট ইনিশিয়েট করা (Public)
const createOnlineDonation = catchAsync(async (req, res) => {
  const { amount, mosqueId } = req.body;
  const credentials = await prisma.bkashCredential.findUnique({
    where: { mosqueId },
  });

  if (!credentials) {
    return res.status(404).json({ success: false, message: "Credentials not found!" });
  }

  const { appKey, appSecret, username, password, isLive } = credentials;
  const baseUrl = isLive 
    ? "https://checkout.pay.bka.sh/v1.2.0-beta" 
    : "https://checkout.sandbox.bka.sh/v1.2.0-beta";

  try {
    // ২. bKash ID Token জেনারেট করা (Grant Token)
    const { data: tokenData } = await axios.post(
      `${baseUrl}/checkout/token/grant`,
      { app_key: appKey, app_secret: appSecret },
      { headers: { username, password } }
    );

    const idToken = tokenData.id_token;

    // ৩. bKash Payment Create করা
    const { data: paymentData } = await axios.post(
      `${baseUrl}/checkout/payment/create`,
      {
        mode: "0011",
        payerReference: req.body.donorPhone,
        callbackURL: `${process.env.BACKEND_URL}/api/online-donations/callback`, // আপনার সার্ভার কলব্যাক
        amount: amount,
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: `INV${Date.now()}`,
      },
      {
        headers: {
          Authorization: idToken,
          "X-APP-Key": appKey,
        },
      }
    );

    // ৪. ডাটাবেসে পেন্ডিং রেকর্ড সেভ করা
    const dbRecord = await onlineDonationServices.createDonationRecordDB({
      ...req.body,
      paymentID: paymentData.paymentID,
      trxID: "PENDING", // পেমেন্ট সাকসেস হওয়ার পর আপডেট হবে
      status: "PENDING",
    });

    // ৫. আসল bkashURL ফ্রন্টএন্ডে পাঠানো
    res.status(httpStatus.OK).json({
      success: true,
      message: "Payment initiated",
      result: {
        bkashURL: paymentData.bkashURL, // এখন এটি আর ডামি নয়, আসল লিঙ্ক
        ...dbRecord,
      },
    });

  } catch (error: any) {
    console.error("bKash Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "bKash payment failed to initiate" });
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

export const onlineDonationController = {
  saveBkashCredentials,
  getDonationHistory,
  handlePaymentCallback,
  createOnlineDonation, // নতুন যুক্ত হয়েছে
};
