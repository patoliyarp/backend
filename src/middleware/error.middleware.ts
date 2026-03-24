import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
export const errorMiddleware = async (
  err: any,
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

  //Handle not operational api error
  if (!(err instanceof ApiError)) {
    const message = "Something went wrong";
    err = new ApiError(message, 500);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
