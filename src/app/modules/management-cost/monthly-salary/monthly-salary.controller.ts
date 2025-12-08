import httpStatus from "http-status";
import { monthlySalaryServices } from "./monthly-salary.services";
import catchAsync from "../../../utils/catchAsync";

const createMonthlySalary = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await monthlySalaryServices.createMonthlySalary(data);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Monthly Salary created successfully",
    result,
  });
});

const getAllMonthlySalaries = catchAsync(async (req, res) => {
  const result = await monthlySalaryServices.getAllMonthlySalaries();
  res.json({
    success: true,
    message: "Monthly salaries fetched successfully",
    result,
  });
});

const getMonthlySalaryById = catchAsync(async (req, res) => {
  const { salaryId } = req.params;
  const result = await monthlySalaryServices.getMonthlySalaryById(salaryId);
  res.json({
    success: true,
    message: "Monthly salary fetched successfully",
    result,
  });
});

const updateMonthlySalary = catchAsync(async (req, res) => {
  const { salaryId } = req.params;
  const data = req.body;
  const result = await monthlySalaryServices.updateMonthlySalary(
    salaryId,
    data
  );
  res.json({
    success: true,
    message: "Monthly salary updated successfully",
    result,
  });
});

const deleteMonthlySalary = catchAsync(async (req, res) => {
  const { salaryId } = req.params;
  await monthlySalaryServices.deleteMonthlySalary(salaryId);
  res.json({
    success: true,
    message: "Monthly salary deleted successfully",
  });
});

export const monthlySalaryController = {
  createMonthlySalary,
  getAllMonthlySalaries,
  getMonthlySalaryById,
  updateMonthlySalary,
  deleteMonthlySalary,
};
