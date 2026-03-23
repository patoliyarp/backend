import type { Request, Response, NextFunction } from "express";

const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Incoming Request: ${req.method}->${req.url}`);
  next();
};

export { requestLoggerMiddleware };
