
import { NextFunction, Request, Response } from "express";
import {  ZodSchema } from "zod";

const validateRequest = (schemaObj: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    
    try {
      await schemaObj.parseAsync(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validateRequest;
