import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import { ApiError } from "../utils/ApiError";
import logger from "../config/logger.config";

export const errorMiddleware: ErrorRequestHandler = async (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!err) {
    next();
  }
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name == "CastError") {
    //Handle mongodb cast error
    const msg = `Resource not found. Invalid ${err.path}`;
    err = new ApiError(msg, 400);
  }
  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(", ")}`;
    err = new ApiError(message, 400);
  }

  // Handle JWT invalid error
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid. Try again.";
    err = new ApiError(message, 400);
  }

  // Handle JWT expired error
  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token has expired. Try again.";
    err = new ApiError(message, 400);
  }

  logger.error(err.message);

  res.status(err.statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
