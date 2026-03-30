import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { UserToken } from "../types/type";
import { JwtPayload } from "jsonwebtoken";

//Express request extend to access user
interface AuthRequest extends Request {
  user?: UserToken | JwtPayload;
}

export const authRoleMiddleware = (...allowedRole: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const role = req.user?.role;

      if (!role || !allowedRole.includes(role)) {
        return next(
          new ApiError(
            "Access denied ,you don't have permission to access ",
            403,
          ),
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
