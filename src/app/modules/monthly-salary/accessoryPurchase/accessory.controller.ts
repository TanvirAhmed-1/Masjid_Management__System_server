import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { accessoryPurchaseServices } from "./accessory.services";


const createPurchase = catchAsync(async (req, res) => {
  const userId = req.user!.id;
  const mosqueId = req.user?.mosqueId;
  const payload = { ...req.body, userId, mosqueId };
  
  const result = await accessoryPurchaseServices.createPurchaseDB(payload);

  res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: 201,
    message: "Accessory purchase recorded successfully",
    result,
  });
});

const getAllPurchases = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;
  const result = await accessoryPurchaseServices.getAllPurchasesDB({
    mosqueId,
    ...req.query,
  });
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: 200,
    message: "Purchases fetched successfully",
    result,
  });
});

const getPurchaseById = catchAsync(async (req, res) => {
  const result = await accessoryPurchaseServices.getPurchaseByIdDB(req.params.id);
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: 200,
    message: "Purchase details fetched successfully",
    result,
  });
});

const updatePurchase = catchAsync(async (req, res) => {
  const result = await accessoryPurchaseServices.updatePurchaseDB(req.params.id, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Purchase updated successfully",
    data: result,
  });
});

const deletePurchase = catchAsync(async (req, res) => {
    const id=req.params.id;
  const result = await accessoryPurchaseServices.deletePurchaseDB(id);
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: 200,
    message: "Purchase record deleted successfully",
    result,
  });
});

export const accessoryPurchaseController = {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
};