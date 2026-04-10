import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { mosqueServices } from "./mosque.services";
import { deleteCache } from "../../utils/cache.util";

const getMosque = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;

  const result = await mosqueServices.getmosqueDB(mosqueId as string);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Mosque get successfully",
    result,
  });
});

const updateMosque = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;
  const data = req.body;
  const result = await mosqueServices.updateMosqueDB(mosqueId as string, data);
  const cacheKey = `mosque:/get-mosque`;
  await deleteCache(cacheKey);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Mosque updated successfully",
    result,
  });
});

export const mosqueController = {
  getMosque,
  updateMosque,
};
