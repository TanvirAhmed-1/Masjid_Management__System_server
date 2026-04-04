import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { RamadanTarabiPaymentService } from "./ramadan-tarabi-salary.servicess";
const createPayment = catchAsync(async (req, res) => {
  const userId = req.user!.id;
  const mosqueId = req.user?.mosqueId;
  const result = await RamadanTarabiPaymentService.createPaymentDB({
    ...req.body,
    userId,
    mosqueId,
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Tarabi payment recorded successfully",
    result,
  });
});

const getAllPayments = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;
  const result = await RamadanTarabiPaymentService.getAllPaymentsDB({
    mosqueId,
    ...req.query,
  });
  res.status(httpStatus.OK).json({
    success: true,
    message: "Tarabi payments fetched successfully",
    result,
  });
});

const getPaymentById = catchAsync(async (req, res) => {
  const result = await RamadanTarabiPaymentService.getPaymentByIdDB(req.params.id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Tarabi payment fetched successfully",
    result,
  });
});

const updatePayment = catchAsync(async (req, res) => {
  
  const result = await RamadanTarabiPaymentService.updatePaymentDB(req.params.id, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Tarabi payment updated successfully",
    result,
  });
});

const deletePayment = catchAsync(async (req, res) => {
  await RamadanTarabiPaymentService.deletePaymentDB(req.params.id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Tarabi payment deleted successfully",
    result: null,
  });
});

export const ramadanTarabiPaymentController = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};