// src/shared/middlewares/cache.middleware.ts

import { getCache, setCache } from "../utils/cache.util";

import { Request, Response, NextFunction } from "express";

export const cacheMiddleware = (keyPrefix: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `${keyPrefix}:${req.originalUrl}`;

    try {
      const cachedData = await getCache(key);

      if (cachedData) {
        return res.status(200).json({
          success: true,
          data: cachedData,
          fromCache: true,
        });
      }

      // Response intercepting logic...
      const originalSend = res.send;
      res.send = function (body): any {
        setCache(key, JSON.parse(body));
        return originalSend.call(this, body);
      };

      next();
    } catch (error) {
      console.error("Cache Error:", error);
      next();
    }
  };
};
