"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitMiddleware = exports.publicLimiter = exports.authLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many request from this IP , please try again after some time",
});
exports.publicLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: "Too many request from this IP , please try again after some time",
});
const reqCount = {};
//Custom middleware for api rate limit
const rateLimitMiddleware = (req, res, next) => {
    const ip = req.ip || "unknown";
    const now = Date.now();
    if (!reqCount[ip]) {
        reqCount[ip] = { count: 1, lastReq: now };
    }
    else {
        const timeSinceLastReq = now - reqCount[ip].lastReq;
        const timeLimit = 15 * 60 * 1000;
        if (timeSinceLastReq < timeLimit) {
            reqCount[ip].count += 1;
        }
        else {
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
exports.rateLimitMiddleware = rateLimitMiddleware;
//# sourceMappingURL=rateLimit.middleware.js.map