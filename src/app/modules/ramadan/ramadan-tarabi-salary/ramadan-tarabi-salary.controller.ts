import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { RamadanIftarSalaryService } from "./ramadan-tarabi-salary.servicess";

const getRamadanIftarSalary = catchAsync(async (req, res) => {
  const { salaryId } = req.params;
  const result = await RamadanIftarSalaryService.fetchSalaryById(salaryId);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Ramadan Iftar Salary fetched successfully",
    result,
  });
});

const getAllPayments = catchAsync(async (req, res) => {
  const result = await RamadanIftarSalaryService.fetchSalaries();
  res.status(httpStatus.OK).json({
    success: true,
    message: "Ramadan Iftar Salary Payments fetched successfully",
    result,
  });
});

const addRamadanIftarSalaryPayment = catchAsync(async (req, res) => {
  const userId = req.user!.id;
  const data = req.body;
  const payload = { ...data, userId };
  const result = await RamadanIftarSalaryService.createSalary(payload);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Ramadan Iftar Salary created successfully",
    result,
  });
});

const addPayment = catchAsync(async (req, res) => {
  const userId = req.user!.id;
  const data = req.body;
  const payload = { ...data, userId };
  const result = await RamadanIftarSalaryService.addPayment(payload);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Ramadan Iftar Salary Payment created successfully",
    result,
  });
});

const updatePayment = catchAsync(async (req, res) => {
  const { paymentId } = req.params;
  const { amount } = req.body;

  if (!paymentId || amount === undefined) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Payment ID and amount are required",
    });
  }

  const result = await RamadanIftarSalaryService.updatePayment(
    paymentId,
    Number(amount)
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: "Ramadan Iftar Salary Payment updated successfully",
    result,
  });
});

const deletePayment = catchAsync(async (req, res) => {
  const { paymentId } = req.params;
  await RamadanIftarSalaryService.deletePayment(paymentId);
  res.status(httpStatus.NO_CONTENT).send();
});

export const ramadanIftarSalaryController = {
  getAllPayments,
  getRamadanIftarSalary,
  addRamadanIftarSalaryPayment,
  addPayment,
  updatePayment,
  deletePayment,
};
