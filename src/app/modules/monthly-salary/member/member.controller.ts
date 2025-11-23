import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { memberServices } from "./member.services";

const createMember = catchAsync(async (req, res) => {
  const userId = req.user!.id;
  const payload = { ...req.body, userId };
  const result = await memberServices.createMemberDB(payload);

  res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: 201,
    message: "Member created successfully",
    result,
  });
});

const getMembers = catchAsync(async (req, res) => {
  const result = await memberServices.getAllMembersDB();
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
