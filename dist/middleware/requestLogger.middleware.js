"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLoggerMiddleware = void 0;
const logger_config_1 = __importDefault(require("../config/logger.config"));
const requestLoggerMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    logger_config_1.default.info(`${req.method} ${req.url}`, {
        userId: req?.user?.id,
        method: req?.method,
        url: req.url,
    });
    console.log(`[${timestamp}] Incoming Request: ${req.method}->${req.url}`);
    next();
};
exports.requestLoggerMiddleware = requestLoggerMiddleware;
//# sourceMappingURL=requestLogger.middleware.js.map