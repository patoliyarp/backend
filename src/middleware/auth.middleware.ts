import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { DecodeToken, UserToken } from "../types/type";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //Get token from user request
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(new ApiError("User is unauthorize", 401));
    }

    const JWT_SECRET = (process.env.JWT_SECRET as string) || "";
    const decode = jwt.verify(token, JWT_SECRET);

    //Decode user info from jwt token
    const decodeUser: UserToken = {
      id: (decode as DecodeToken).id,
      email: (decode as DecodeToken).email,
      role: (decode as DecodeToken).role,
    };

    if (!decode) {
      return next(new ApiError("login is expired please login again", 403));
    }

    //Attach user to request object
    req.user = decodeUser;
    next();
  } catch (error) {
    next(error);
  }
};
