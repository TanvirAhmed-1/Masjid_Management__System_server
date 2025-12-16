import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { mosqueServices } from "./mosque.services";

const createmosque = catchAsync(async (req, res) => {
  const payload = req.body;
  if (!req.user?.id) throw new Error("Unauthorized");

  const superAdminId = req.user.id;

  const result = await mosqueServices.createMosqueWithAdminDB(
    payload,
    superAdminId
  );

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Mosque and Admin created successfully",
    data: result,
  });
});

const getAllMosques = catchAsync(async (req, res) => {
  const result = await mosqueServices.getAllMosquesDB();
  res.status(httpStatus.OK).json({
    success: true,
    message: "Mosques fetched successfully",
    data: result,
  });
});

const getMosqueById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await mosqueServices.getMosqueByIdDB(id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Mosque fetched successfully",
    data: result,
  });
});

const updateMosque = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await mosqueServices.updateMosqueDB(id, payload);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Mosque updated successfully",
    data: result,
  });
});

const deleteMosque = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await mosqueServices.deleteMosqueDB(id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Mosque deleted successfully",
    data: result,
  });
});

export const mosqueController = {
  createmosque,
  getAllMosques,
  getMosqueById,
  updateMosque,
  deleteMosque,
};
