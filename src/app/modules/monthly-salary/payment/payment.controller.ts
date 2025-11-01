import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { paymentService } from "./payment.services";

const createPayment = catchAsync(async (req, res) => {
  const result = await paymentService.create(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: 201,
    message: "Payment created successfully",
    result,
  });
});

const getMonthlyPayments = catchAsync(async (req, res) => {
  const { monthKey } = req.query;
  const result = await paymentService.getMonthlyPayments(monthKey as string);
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: 200,
    message: "Payment fetched successfully",
    result,
  });
});

const updatePayment = catchAsync(async (req, res) => {
  const result = await paymentService.updatePaymentDB(req.params.id, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: 200,
    message: "Payment updated successfully",
    result,
  });
});

const deletePayment = catchAsync(async (req, res) => {
  const result = await paymentService.deletePaymentDB(req.params.id);
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: 200,
    message: "Payment deleted successfully",
    result,
  });
});

export const paymentController = {
  createPayment,
  getMonthlyPayments,
  updatePayment,
  deletePayment,
};
