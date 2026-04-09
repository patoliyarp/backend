import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError";

export const expressValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new ApiError(`${error.array().map((err) => err.msg)}`, 400));
  }
  next();
};
