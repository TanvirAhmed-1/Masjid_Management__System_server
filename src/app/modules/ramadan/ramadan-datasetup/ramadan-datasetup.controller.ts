import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { dateSetUpServicess } from "./ramadan-datasetup.servisess";

const createdRamadanDatasetUp = catchAsync(async (req, res) => {
  const userId = req.user!.id;
  const mosqueId = req.user?.mosqueId;
  if (!mosqueId) throw new Error("Mosque ID is required");
  if (!userId) throw new Error("User not authenticated");

  const data = req.body;
  const payload = {
    ...data,
    userId,
    mosqueId,
  };
  const result = await dateSetUpServicess.createrRamadanDataSetupDB(payload);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Ramadan Data SetUp  create successfully",
    result,
  });
});

const getRamadanDatasetUp = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;
  const result = await dateSetUpServicess.fetchRamadanDataDB({
    mosqueId,
    ...req.query,
  });
  res.status(httpStatus.OK).json({
    success: true,
    message: "Data feaching successfully",
    result,
  });
});

const updateRamadanDatasetUp = catchAsync(async (req, res) => {
  const { ramadanyearId } = req.params;
  const result = await dateSetUpServicess.updateRamadanDataSetupBD(
    ramadanyearId,
    req.body,
  );
  res.status(httpStatus.OK).json({
    success: true,
    message: "Data Update successfully",
    result,
  });
});

const deleteRamadanDatasetUp = catchAsync(async (req, res) => {
  const { ramadanyearId } = req.params;

  const result =
    await dateSetUpServicess.deleteRamadanDataSetupBD(ramadanyearId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "User deleted successfully",
    result,
  });
});

export const ramadandatacontroller = {
  createdRamadanDatasetUp,
  getRamadanDatasetUp,
  updateRamadanDatasetUp,
  deleteRamadanDatasetUp,
};
