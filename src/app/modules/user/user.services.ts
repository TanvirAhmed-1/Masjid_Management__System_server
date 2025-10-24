import prisma from "../../utils/prisma";
import { Tuser } from "./user.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config(); 

const createUserDB = async (payload: Tuser) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const existingEmail=await prisma.user.findUnique({
    where:{email:payload.email}
  })
  if (existingEmail) {
    throw new Error("Email already exists!");
  }
  return await prisma.user.create({
    data: { ...payload, password: hashedPassword },
  });
};

const getUserDB = async () => {
  return await prisma.user.findMany();
};

const updateProfileDB = async (userId: string, payload: Partial<Tuser>) => {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existing) {
    throw new Error("User ID not valid!");
  }

  return await prisma.user.update({
    where: { id: userId },
    data: payload,
  });
};

const deleteUserDB = async (userId: string) => {
  return await prisma.user.delete({
    where: { id: userId },
  });
};

const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("User email not found!");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password!");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  // ✅ Check for environment variables
  if (!process.env.TOKEN_SECRET_KEY || !process.env.REFRESHTOKEN_SECRET_KEY) {
    throw new Error("JWT secret keys are missing in environment variables");
  }

  // ✅ Access Token
  const accessToken = jwt.sign(jwtPayload, process.env.TOKEN_SECRET_KEY, {
    expiresIn: "7d",
  });

  // ✅ Refresh Token
  const refreshToken = jwt.sign(
    jwtPayload,
    process.env.REFRESHTOKEN_SECRET_KEY,
    { expiresIn: "30d" } // usually longer than access token
  );

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    accessToken,
    refreshToken,
  };
};

export const userServices = {
  createUserDB,
  getUserDB,
  updateProfileDB,
  deleteUserDB,
  loginUser,
};
