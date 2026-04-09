import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
export const invalidRouteMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const err = new ApiError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
};
