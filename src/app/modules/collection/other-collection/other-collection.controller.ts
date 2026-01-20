import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { otherCollectionService } from "./other-collection.services";

const createCollection = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;
  if (!mosqueId) throw new Error("Mosque ID is required");
  if (!req.user?.id) throw new Error("User not authenticated");

  const data = req.body;
  const payload = { ...data, userId: req.user.id, mosqueId };
  const result = await otherCollectionService.createCollectionDB(payload);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Collection created successfully",
    result,
  });
});

const deleteDonor = catchAsync(async (req, res) => {
  const { donorId } = req.params;
  if (!donorId) throw new Error("Donor ID is required");
  const result = await otherCollectionService.deleteDonorDB(donorId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Donor deleted successfully",
    result,
  });
});

// -------------------- Update Donor --------------------
const updateDonor = catchAsync(async (req, res) => {
  const { donorId } = req.params;
  if (!donorId) throw new Error("Donor ID is required");
  const { name, amount } = req.body;

  const result = await otherCollectionService.updateDonorDB(donorId, {
    name,
    amount,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "Donor updated successfully",
    result,
  });
});

const getAllCollection = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;
  const result = await otherCollectionService.getAllCollectionsDB({
    ...req.query,
    mosqueId,
  });
  res.status(httpStatus.OK).json({
    success: true,
    message: "Collections fetched successfully",
    data: result,
  });
});

const updateCollection = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Collection ID is required");
  const { donors } = req.body;

  const result = await otherCollectionService.updateColeectionDB(id, donors);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Collection updated successfully",
    result,
  });
});

const CreateDoner = catchAsync(async (req, res) => {
  const { collectionId, name, amount } = req.body;

  const result = await otherCollectionService.createDonerDB({
    collectionId,
    name,
    amount,
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Donor created successfully",
    result,
  });
});

// -------------------- Get Collection By ID --------------------
const getCollectionById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const mosqueId = req.user?.mosqueId;

  const result = await otherCollectionService.getCollectionByIdDB({
    id,
    mosqueId,
    ...req.query,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "Collection fetched successfully",
    result,
  });
});

// -------------------- Delete Collection --------------------
const deleteCollection = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await otherCollectionService.deleteCollectionDB(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Collection deleted successfully",
    result,
  });
});

export const otherCollectionController = {
  createCollection,
  getAllCollection,
  getCollectionById,
  deleteCollection,
  deleteDonor,
  updateDonor,
  updateCollection,
  CreateDoner,
};
