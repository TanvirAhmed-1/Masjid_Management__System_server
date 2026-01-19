import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { OtherCollectionNameServices } from "./otherCollectionName.services";

const createcollectionName = catchAsync(async (req, res) => {
  const payload = req.body;
  const userid = req.user?.id;
  const mosqueId = req.user?.mosqueId;
  const data = {
    ...payload,
    userId: userid,
    mosqueId: mosqueId,
  };
  const result = await OtherCollectionNameServices.createcollectionName(data);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Other Collection Name created successfully",
    data: result,
  });
});

const getAllcollectionName = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;
  const result = await OtherCollectionNameServices.getAllCollectionName({
    ...req.query,
    mosqueId: mosqueId,
  });
  res.status(httpStatus.OK).json({
    success: true,
    message: "Other Collection Name fetched successfully",
    data: result,
  });
});

const updatecollectionName = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await OtherCollectionNameServices.updatecollectionName(
    id,
    payload,
  );
  res.status(httpStatus.OK).json({
    success: true,
    message: "Other Collection Name updated successfully",
    data: result,
  });
});

const deletecollectionName = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OtherCollectionNameServices.deletecollectionName(id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Other Collection Name deleted successfully",
    data: result,
  });
});
export const otherCollectionNameController = {
  createcollectionName,
  getAllcollectionName,
  updatecollectionName,
  deletecollectionName,
};
