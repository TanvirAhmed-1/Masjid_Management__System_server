import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { FridayCollectionServices } from "./friday-collection.services";

const createfridaycollection = catchAsync(async (req, res) => {
  const payload = req.body;
  const userid = req.user?.id;
  const mosqueId = req.user?.mosqueId;
console.log("USER ID:", userid, "MOSQUE ID:", mosqueId);
  if (!mosqueId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "User or Mosque not found in token",
    });
  }

  const result = await FridayCollectionServices.createFridayCollectionDB({
    ...payload,
    userId: userid!,
    mosqueId: mosqueId!,
  });
  res.status(httpStatus.OK).json({
    success: true,
    message: "Friday Collection created successfully",
    data: result,
  });
});
const getAllFridayCollection = catchAsync(async (req, res) => {
  const result = await FridayCollectionServices.getallcollectionDB();
  res.status(httpStatus.OK).json({
    success: true,
    message: "Friday Collection fetched successfully",
    data: result,
  });
});
const updateFridayCollection = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await FridayCollectionServices.updateFridayCollectionDB(
    id,
    payload
  );
  res.status(httpStatus.OK).json({
    success: true,
    message: "Friday Collection updated successfully",
    data: result,
  });
});
const deleteFridayCollection = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FridayCollectionServices.deleteFridayCollectionDB(id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Friday Collection deleted successfully",
    data: result,
  });
});
export const fridayCollectionController = {
  createfridaycollection,
  getAllFridayCollection,
  updateFridayCollection,
  deleteFridayCollection,
};
