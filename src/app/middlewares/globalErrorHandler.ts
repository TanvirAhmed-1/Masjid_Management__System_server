import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(" Global Error:", err);

  let statusCode = 500;
  let message = "Something went wrong";

  // Handle Prisma unique constraint error safely
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    statusCode = httpStatus.CONFLICT;

    const target = err.meta?.target || err.meta?.targetFields;

    let fieldNames: string;
    if (Array.isArray(target)) {
      fieldNames = target.join(", ");
    } else if (typeof target === "string") {
      fieldNames = target;
    } else {
      fieldNames = "unknown field";
    }

    message = `Duplicate field value for: ${fieldNames}`;
  }

  //  Handle Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = err.issues.map((issue) => issue.message).join(", ");
  }

  //  Other JS errors
  else if (err instanceof Error) {
    message = err.message;
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
