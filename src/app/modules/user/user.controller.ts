
import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status";
import { loginSchema } from "./user.validation";
import { userServices } from "./user.services";

// Create User
const createdUser = catchAsync(async (req, res) => {
  const result = await userServices.createUserDB(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: 201,
    message: "User created successfully",
    result,
  });
});

// Fetch All Users
const fetchUser = catchAsync(async (req, res) => {
  console.log("Token received:", req.headers.authorization);

  const result = await userServices.getUserDB();
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: 200,
    message: "User fetched successfully",
    result,
  });
});

// Update User
const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await userServices.updateProfileDB(userId, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: "User updated successfully",
    result,
  });
});

// Delete User
const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await userServices.deleteUserDB(userId);
  res.status(httpStatus.OK).json({
    success: true,
    message: "User deleted successfully",
    result,
  });
});

// Login User
const loginUser = catchAsync(async (req, res) => {
  console.log("Login request body:", req.body);
  // Validate input using Zod
  const{email,password}=req.body

  // Login service
  const result = await userServices.loginUser(email,password);

  // Set refreshToken in cookie
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // prod = true
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send response
  res.status(httpStatus.OK).json({
    success: true,
    message: "User logged in successfully",
    result,
  });
});

export const UserController = {
  createdUser,
  fetchUser,
  updateUser,
  deleteUser,
  loginUser,
};
