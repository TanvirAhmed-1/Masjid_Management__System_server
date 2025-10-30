import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { ifterlistServices } from "./ifterlist.services";

const getifterlist = catchAsync(async (req, res) => {
  const result = await ifterlistServices.getifterlistDB();
  res.status(httpStatus.OK).json({
    success: true,
    message: "ifterlist records fetched successfully",
    result,
  });
});

const getsingleifterlist = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ifterlistServices.getSingleItikaDB(id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "ifterlist record fetched successfully",
    result,
  });
});

const createifterlist = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const data = req.body;
  const payload = { ...data, userId };
  const result = await ifterlistServices.createlistDB(payload);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "ifterlist record created successfully",
    result,
  });
});

const deleteifterlist = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ifterlistServices.deleteifterlistDB(id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "ifterlist record deleted successfully",
    result,
  });
});

const updateifterlist = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await ifterlistServices.updateifterlistDB(id, data);
  res.status(httpStatus.OK).json({
    success: true,
    message: "ifterlist record updated successfully",
    result,
  });
});

export const ifterlistcontroller = {
  getifterlist,
  createifterlist,
  deleteifterlist,
  updateifterlist,
  getsingleifterlist,
};
