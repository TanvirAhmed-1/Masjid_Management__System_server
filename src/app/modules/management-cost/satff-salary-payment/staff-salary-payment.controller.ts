import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { staffSalaryPaymentServices } from "./staff-salary-payment.services";

const createStaffSalaryPayment = catchAsync(async (req, res) => {
  const payload = {
    ...req.body,
    userId: req.user!.id,
    mosqueId: req.user!.mosqueId,
  };

  const result =
    await staffSalaryPaymentServices.createSalaryPaymentDB(payload);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Salary payment created successfully",
    result,
  });
});

const getAllStaffSalaryPayments = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;
  const result = await staffSalaryPaymentServices.getAllSalaryPaymentDB({
    ...req.query,
    mosqueId,
  });
  res.status(httpStatus.OK).json({
    success: true,
    message: "staff fetched successfully",
    result,
  });
});

const updateStaffSalaryPayment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await staffSalaryPaymentServices.updateSalaryPaymentDB(
    id,
    data,
  );
  res.status(httpStatus.OK).json({
    success: true,
    message: "staff updated successfully",
    result,
  });
});

const deleteStaffSalaryPayment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await staffSalaryPaymentServices.deleteSalaryPaymentDB(id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "staff deleted successfully",
    result,
  });
});
export const staffSalaryPaymentController = {
  createStaffSalaryPayment,
  getAllStaffSalaryPayments,
  updateStaffSalaryPayment,
  deleteStaffSalaryPayment,
};
