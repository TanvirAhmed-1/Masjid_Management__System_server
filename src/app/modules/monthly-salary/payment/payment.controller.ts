// src/modules/payment/payment.controller.ts
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { paymentService } from "./payment.services";


const createPayment = catchAsync(async (req, res) => {
  const userId = req.user!.id;
  const result = await paymentService.createPayment({ ...req.body, userId });

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "পেমেন্ট সফলভাবে যোগ করা হয়েছে",
    data: result,
  });
});

const getMemberSummary = catchAsync(async (req, res) => {
  const { memberId } = req.params;
  const result = await paymentService.getMemberPaymentSummary(memberId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "মেম্বারের পেমেন্ট সামারি",
    data: result,
  });
});

const getMonthlyReport = catchAsync(async (req, res) => {
  const { monthKey } = req.params;
  const result = await paymentService.getMonthlyCollection(monthKey);

  res.status(httpStatus.OK).json({
    success: true,
    message: `${monthKey} মাসের কালেকশন রিপোর্ট`,
    data: result,
  });
});

const getAllPayments = catchAsync(async (req, res) => {
  const result = await paymentService.getAllPayments();
  res.status(httpStatus.OK).json({
    success: true,
    message: "সব পেমেন্ট",
    data: result,
  });
});

export const paymentController = {
  createPayment,
  getMemberSummary,
  getMonthlyReport,
  getAllPayments,
};