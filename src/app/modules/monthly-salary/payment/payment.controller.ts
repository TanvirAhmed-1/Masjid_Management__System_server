// src/modules/payment/payment.controller.ts
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { paymentService } from "./payment.services";

const createPayment = catchAsync(async (req, res) => {
  const userId = req.user!.id;
  const result = await paymentService.createPayment({ ...req.body, userId });

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "payment created successfully",
    data: result,
  });
});

const getMemberSummary = catchAsync(async (req, res) => {
  const { memberId } = req.params;
  const result = await paymentService.getMemberPaymentSummary(memberId);

  res.status(httpStatus.OK).json({
    success: true,
    message: " successfully fetching Member payment summary",
    data: result,
  });
});

const getMonthlyReport = catchAsync(async (req, res) => {
  const { monthKey } = req.params;
  const result = await paymentService.getMonthlyCollection(monthKey);

  res.status(httpStatus.OK).json({
    success: true,
    message: `Successfully fetched collection report for ${monthKey}`,
    data: result,
  });
});

const getAllPayments = catchAsync(async (req, res) => {
  const result = await paymentService.getAllPayments();
  res.status(httpStatus.OK).json({
    success: true,
    message: "Successfully fetched all payments",
    data: result,
  });
});

export const paymentController = {
  createPayment,
  getMemberSummary,
  getMonthlyReport,
  getAllPayments,
};
