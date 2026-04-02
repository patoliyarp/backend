import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1,
  message: "Too many request from this IP , please try again after some time",
});

export const publicLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: "Too many request from this IP , please try again after some time",
});

interface RateLimitData {
  count: number;
  lastReq: number;
}

const reqCount: Record<string, RateLimitData> = {};

//Custom middleware for api rate limit
export const rateLimitMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ip = req.ip || "unknown";
  const now = Date.now();

  if (!reqCount[ip]) {
    reqCount[ip] = { count: 1, lastReq: now };
  } else {
    const timeSinceLastReq = now - reqCount[ip].lastReq;
    const timeLimit = 15 * 60 * 1000;

    if (timeSinceLastReq < timeLimit) {
      reqCount[ip].count += 1;
    } else {
      reqCount[ip] = { count: 1, lastReq: now };
    }

    const maxReq = 100;
    if (reqCount[ip].count > maxReq) {
      return res
        .status(429)
        .json({ message: "Too many requests, please try after some time" });
    }
    reqCount[ip].lastReq = now;
    next();
  }
};
