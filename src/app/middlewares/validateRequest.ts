import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

// const validateRequest = (schemaObj: ZodSchema) => {
//   return async (req: Request, res: Response, next: NextFunction) => {

//     try {
//       await schemaObj.parseAsync(req.body);
//       next();
//     } catch (err) {
//       next(err);
//     }
//   };
// };

// export default validateRequest;

const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body); // direct body validation
      next();
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: err.errors?.[0]?.message || "Validation error",
      });
    }
  };
};
export default validateRequest;
