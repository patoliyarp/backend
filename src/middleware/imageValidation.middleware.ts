import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const imageValidateMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const image = req.file?.buffer;
  if (!image) {
    return next();
  } else {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(req.file?.mimetype.split("/")[1] || "");
    const imageSize =
      (req.file?.size && Number((req.file?.size / 1024 ** 2).toFixed(2))) || 0;

    if (!mimeType) {
      const err = new ApiError(
        "Image format must be *jpeg , jpg , png , gif ",
        400,
      );
      return next(err);
    }

    if (imageSize > 1) {
      const err = new ApiError("Image size must be less than 1MB", 400);
      return next(err);
    }
    next();
  }
};
