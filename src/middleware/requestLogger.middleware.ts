import type { Request, Response, NextFunction } from "express";
import logger from "../config/logger.config";

const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const timestamp = new Date().toISOString();
  logger.info(`${req.method} ${req.url}`, {
    userId: req?.user?.id,
    method: req?.method,
    url: req.url,
  });

  console.log(`[${timestamp}] Incoming Request: ${req.method}->${req.url}`);
  next();
};

export { requestLoggerMiddleware };
