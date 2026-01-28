// src/modules/payment/payment.controller.ts
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { paymentService } from "./payment.services";

const createPayment = catchAsync(async (req, res) => {
  const userId = req.user!.id;
  const mosqueId = req.user?.mosqueId;
  const result = await paymentService.createPayment({
    ...req.body,
    userId,
    mosqueId,
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "payment created successfully",
    data: result,
  });
});

const getMemberSummary = catchAsync(async (req, res) => {
  const { memberId } = req.params;
  const mosqueId = req.user?.mosqueId;
  const result = await paymentService.getMemberPaymentSummary({
    memberId,
    mosqueId,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: " successfully fetching Member payment summary",
    data: result,
  });
});

const getMonthlyReport = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;
  const { monthKey } = req.params;
  const result = await paymentService.getMonthlyCollection({
    monthKey,
    mosqueId,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: `Successfully fetched collection report for ${monthKey}`,
    data: result,
  });
});

const getAllPayments = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;
  const result = await paymentService.getAllPayments({
    ...req.query,
    mosqueId,
  });
  res.status(httpStatus.OK).json({
    success: true,
    message: "Successfully fetched all payments",
    data: result,
  });
});

const deletePayment = catchAsync(async (req, res) => {
  const result = await paymentService.deletePaymentBD(req.params.paymentId);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Successfully deleted payment",
    data: result,
  });
});

export const paymentController = {
  createPayment,
  getMemberSummary,
  getMonthlyReport,
  getAllPayments,
  deletePayment,
};
