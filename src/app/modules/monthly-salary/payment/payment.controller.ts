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

const getYearlyReport = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;
  const year = req.params.year;
   const { page, limit } = req.query;

  const result = await paymentService.getYearlyCollection({
    year,
    mosqueId,
    page: Number(page),
    limit: Number(limit),
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: `Successfully fetched year base payment`,
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

const updatePayment = catchAsync(async (req, res) => {
  const id = req.params.id;
  const mosqueId = req.user?.mosqueId;

  const { memberId, monthKey, amount } = req.body;

  const result = await paymentService.updatePaymentDB({
    id,
    mosqueId,
    data: { memberId, monthKey, amount },
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "Successfully updated payment",
    data: result,
  });
});

const deletePayment = catchAsync(async (req, res) => {
  const paymentId = req.params.paymentId;
  const mosqueId = req.user?.mosqueId;
  const result = await paymentService.deletePaymentBD(paymentId, mosqueId);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Successfully deleted payment",
    data: result,
  });
});

export const paymentController = {
  createPayment,
  getMemberSummary,
  getYearlyReport,
  getAllPayments,
  updatePayment,
  deletePayment,
};
