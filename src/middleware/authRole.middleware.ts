import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";


export const authRoleMiddleware = (...allowedRole: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
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
