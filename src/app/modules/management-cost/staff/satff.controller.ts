import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { staffServices } from "./satff.services";

const createsatff = catchAsync(async (req, res) => {
  const data = req.body;
  const userid = req.user?.id;
  const mosqueId = req.user?.mosqueId;
  if (!mosqueId) {
    throw new Error("Mosque ID is required");
  }
  const payload = {
    ...data,
    userId: userid,
    mosqueId,
  };
  
  const result = await staffServices.createstffDB(payload);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "staff created successfully",
    result,
  });
});

const getAllstaff = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;
  const result = await staffServices.getAllstaffDB({ mosqueId, ...req.query });
  res.status(httpStatus.OK).json({
    success: true,
    message: "staff fetched successfully",
    result,
  });
});

const getstaffById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await staffServices.getstaffByIdDB(id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "staff fetched successfully",
    result,
  });
});
const updatestaff = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await staffServices.updatestaffDB(id, data);
  res.status(httpStatus.OK).json({
    success: true,
    message: "staff updated successfully",
    result,
  });
});

const deletestaff = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await staffServices.deletestaffDB(id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "staff deleted successfully",
    result,
  });
});
export const satffController = {
  createsatff,
  getAllstaff,
  getstaffById,
  updatestaff,
  deletestaff,
};
