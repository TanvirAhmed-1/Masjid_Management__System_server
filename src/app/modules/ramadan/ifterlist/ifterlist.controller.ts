import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { ifterlistServices } from "./ifterlist.services";

const createifterlist = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const payload = {
    userId,
    ...req.body,
  };

  const result = await ifterlistServices.createlistDB(payload);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Iftar list created successfully",
    result,
  });
});

const getifterlist = catchAsync(async (req, res) => {
  const result = await ifterlistServices.getifterlistDB();
  res.status(httpStatus.OK).json({
    success: true,
    message: "Iftar list records fetched successfully",
    result,
  });
});

const getsingleifterlist = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ifterlistServices.getSingleItikaDB(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Iftar list record fetched successfully",
    result,
  });
});

const updateifterlist = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await ifterlistServices.updateifterlistDB(id, data);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Iftar list record updated successfully",
    result,
  });
});

const deleteifterlist = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ifterlistServices.deleteifterlistDB(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Iftar list record deleted successfully",
    result,
  });
});

const deleteifterdoner = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ifterlistServices.deleteifterdonerDD(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Iftar list Doner deleted successfully",
    result,
  });
});

export const ifterlistcontroller = {
  createifterlist,
  getifterlist,
  getsingleifterlist,
  updateifterlist,
  deleteifterlist,
  deleteifterdoner,
};
