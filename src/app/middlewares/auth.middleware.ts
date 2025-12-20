import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import verifyToken from "../utils/verifyToken";
import prisma from "../utils/prisma";
import { RoleType } from "@prisma/client";

// export const auth = (...requiredRoles: RoleType[]) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     //const token = req.headers.authorization;
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(httpStatus.UNAUTHORIZED).json({
//         success: false,
//         message: "Unauthorized  User",
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     let decoded: any;
//     try {
//       decoded = verifyToken(token);
//     } catch (err) {
//       return res.status(httpStatus.UNAUTHORIZED).json({
//         success: false,
//         message: "Unauthorized: Invalid or expired token",
//       });
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: decoded.id },
//     });

//     const mosque = await prisma.mosque.findUnique({
//       where: { id: user?.mosqueId },
//     });

//     if (!!mosque) {
//       return res.status(httpStatus.UNAUTHORIZED).json({
//         success: false,
//         message: "Unauthorized: mosque not found",
//       });
//     }

//     if (!user) {
//       return res.status(httpStatus.UNAUTHORIZED).json({
//         success: false,
//         message: "Unauthorized: User not found",
//       });
//     }

//     if (
//       requiredRoles.length &&
//       !requiredRoles.includes(user.role as RoleType)
//     ) {
//       return res.status(httpStatus.FORBIDDEN).json({
//         success: false,
//         message: "Forbidden: insufficient role",
//       });
//     }

//     req.user = {
//       id: user.id,
//       email: user.email!,
//       name: user.name!,
//       role: user.role as RoleType,
//     };

//     next();
//   });
// };

export const auth = (...requiredRoles: RoleType[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded: any;
    try {
      decoded = verifyToken(token);
    } catch {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized: Invalid or expired token",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        mosqueId: true,
      },
    });

    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    // ✅ mosque validation (FIXED)
    if (user.mosqueId) {
      const mosque = await prisma.mosque.findUnique({
        where: { id: user.mosqueId },
        select: { id: true },
      });

      if (!mosque) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized: Mosque not found",
        });
      }
    }

    console.log("User Role:", user.mosqueId);

    // ✅ Role check
    if (
      requiredRoles.length &&
      !requiredRoles.includes(user.role as RoleType)
    ) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: "Forbidden: insufficient role",
      });
    }

    // ✅ mosqueId added here
    req.user = {
      id: user.id,
      email: user.email!,
      name: user.name!,
      role: user.role as RoleType,
      mosqueId: user.mosqueId!,
    };

    next();
  });
};
