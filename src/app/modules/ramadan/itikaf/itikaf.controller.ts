import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { itikaServices } from "./itikaf.servicess";


const createItika = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const data = req.body;

  const payload = { ...data, userId };
  const result = await itikaServices.createItikaDB(payload);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Itika record created successfully",
    result,
  });
});

const getAllItika = catchAsync(async (req, res) => {
  const result = await itikaServices.getAllItikaDB();
  res.status(httpStatus.OK).json({
    success: true,
    message: "Itika records fetched successfully",
    result,
  });
});

const getSingleItika = catchAsync(async (req, res) => {
  const { ramadanId } = req.params;
  const result = await itikaServices.getSingleItikaDB(ramadanId);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Itika record fetched successfully",
    result,
  });
});

const updateItika = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await itikaServices.updateItikaDB(id, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Itika record updated successfully",
    result,
  });
});

const deleteItika = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await itikaServices.deleteItikaDB(id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Itika record deleted successfully",
    result,
  });
});

export const itikaController = {
  createItika,
  getAllItika,
  getSingleItika,
  updateItika,
  deleteItika,
};
