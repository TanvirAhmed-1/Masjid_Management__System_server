import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { memberServices } from "./member.services";
import { ICreateMemberInput } from "./member.interface";

// Create Member
const createMember = catchAsync(async (req, res) => {
  const payload: ICreateMemberInput = req.body;
  const userid = req.user?.id;
  const mosqueId = req.user?.mosqueId;

  if (!mosqueId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "User or Mosque not found in token",
    });
  }

  const member = await memberServices.createMemberDB(
    {
      ...payload,
      mosqueId,
    },
    userid!,
  );

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Member created successfully",
    data: member,
  });
});

// Get all Members
const getAllMembers = catchAsync(async (req, res) => {
  const mosqueId = req.user?.mosqueId;
  const members = await memberServices.getAllMembersDB({
    mosqueId,
    ...req.query,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "Members fetched successfully",
    data: members,
  });
});

// Get Member by ID
const getMemberById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const member = await memberServices.getMemberByIdDB(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Member fetched successfully",
    data: member,
  });
});

// Update Member
const updateMember = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const updatedMember = await memberServices.updateMemberDB(id, payload);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Member updated successfully",
    data: updatedMember,
  });
});

// Delete Member
const deleteMember = catchAsync(async (req, res) => {
  const { id } = req.params;
  const mosqueId = req.user?.mosqueId;
  if (!mosqueId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "User or Mosque not found in token",
    });
  }
  const deletedMember = await memberServices.deleteMemberDB(id, mosqueId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Member deleted successfully",
    data: deletedMember,
  });
});

export const memberController = {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
};
