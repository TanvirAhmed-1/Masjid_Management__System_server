import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { otherCollectionService } from "./other-collection.services";

const createCollection = catchAsync(async (req, res) => {
  const data = req.body;
  const userid = req.user?.id;
   if (!req.user?.id) {
    throw new Error("User not authenticated");
  }
  const payload = {
    ...data,
    userId: userid!,
  };
  const result = await otherCollectionService.createcollectionDB(payload);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Collection created successfully",
    result,
  });
});

const getAllCollection = catchAsync(async (req, res) => {
  const result = await otherCollectionService.getAllCollectionsDB();
  res.status(httpStatus.OK).json({
    success: true,
    message: "Collection fetched successfully",
    result,
  });
});
const updateCollection = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { donors } = req.body;

  const result = await otherCollectionService.updateDonorsDB(id, donors);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Collection updated successfully",
    result,
  });
});

const deleteCollection = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await otherCollectionService.deletecollectionDB(id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Collection deleted successfully",
    result,
  });
});
export const otherCollectionController = {
  createCollection,
  getAllCollection,
  updateCollection,
  deleteCollection,
};
