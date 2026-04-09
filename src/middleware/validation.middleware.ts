import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ApiError } from "../utils/ApiError";

export const validateData = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationResult = schema.safeParse(req.body);

      if (!validationResult.success) {
        return next(
          new ApiError(`${validationResult.error.issues[0].message}`, 400),
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
