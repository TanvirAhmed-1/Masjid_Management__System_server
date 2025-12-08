import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { MemberAccessoryPurchaseService } from "./management-purchase.services";

const createPurchase = catchAsync(async (req, res) => {
  const data = req.body;
  const userid = req.user?.id;
  const payload = {
    ...data,
    userId: userid,
  };
  const result = await MemberAccessoryPurchaseService.createPurchaseDB(payload);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Purchase created successfully",
    result,
  });
});
const getAllPurchases = catchAsync(async (req, res) => {
  const result = await MemberAccessoryPurchaseService.fetchAllPurchasesDB();
  res.status(httpStatus.OK).json({
    success: true,
    message: "Purchases fetched successfully",
    result,
  });
});
const getPurchaseById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MemberAccessoryPurchaseService.fetchPurchaseByIdDB(id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Purchase fetched successfully",
    result,
  });
});

const updatePurchase = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await MemberAccessoryPurchaseService.updatePurchaseDB(
    id,
    data
  );
  res.status(httpStatus.OK).json({
    success: true,
    message: "Purchase updated successfully",
    result,
  });
});
const deletePurchase = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MemberAccessoryPurchaseService.deletePurchaseDB(id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Purchase deleted successfully",
    result,
  });
});
export const managementPurchaseController = {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
};
