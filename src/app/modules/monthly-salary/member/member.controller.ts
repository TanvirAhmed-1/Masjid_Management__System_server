import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { memberServices } from "./member.services";
import { getCache, setCache } from "../../../utils/cache.util";

const createMember = catchAsync(async (req, res) => {
  const userId = req.user!.id;
  const mosqueId = req.user?.mosqueId;
  const payload = { ...req.body, userId, mosqueId };
  const result = await memberServices.createMemberDB(payload);

  res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: 201,
    message: "Member created successfully",
    result,
  });
});

const getMembers = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;
  if (!mosqueId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Mosque ID not found in token",
    });
  }

  const filter = req.query || {};
  const cacheKey = `members:list:${mosqueId}:${filter.page || 1}:${filter.limit || 20}:${filter.sortBy || "createdAt"}:${filter.sortOrder || "desc"}:${filter.name || "none"}:${filter.phone || "none"}:${filter.address || "none"}`;

  try {
    const cachedResult = await getCache(cacheKey);
    if (cachedResult) {
      return res.status(httpStatus.OK).json({
        success: true,
        statusCode: 200,
        message: "Members fetched successfully (from Cache)",
        result: cachedResult,
      });
    }
  } catch (error) {
    console.error("Redis error fetching members cache:", error);
  }

  const result = await memberServices.getAllMembersDB({
    mosqueId,
    ...req.query,
  });

  try {
    await setCache(cacheKey, result, 3600);
  } catch (error) {
    console.error("Redis error setting members cache:", error);
  }

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: 200,
    message: "Members fetched successfully",
    result,
  });
});

const getMemberById = catchAsync(async (req, res) => {
  const result = await memberServices.getMemberByIdDB(req.params.id);
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: 200,
    message: "Member fetched successfully",
    result,
  });
});

const updateMember = catchAsync(async (req, res) => {
  const result = await memberServices.updateMenberDB(req.params.id, req.body);

  if (!result) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "Member not found",
    });
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Member updated successfully",
    data: result,
  });
});

const deleteMember = catchAsync(async (req, res) => {
  const result = await memberServices.deleteMemberDB(req.params.id);
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: 200,
    message: "Member deleted successfully",
    result,
  });
});

export const memberController = {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
};
