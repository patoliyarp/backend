"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
const logger_config_1 = __importDefault(require("../config/logger.config"));
const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
    }
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    if (err.name == "CastError") {
        //Handle mongodb cast error
        const msg = `Resource not found. Invalid ${err.path}`;
        err = new ApiError_1.ApiError(msg, 400);
    }
    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(", ")}`;
        err = new ApiError_1.ApiError(message, 400);
    }
    // Handle JWT invalid error
    if (err.name === "JsonWebTokenError") {
        const message = "JSON Web Token is invalid. Try again.";
        err = new ApiError_1.ApiError(message, 400);
    }
    // Handle JWT expired error
    if (err.name === "TokenExpiredError") {
        const message = "JSON Web Token has expired. Try again.";
        err = new ApiError_1.ApiError(message, 400);
    }
    logger_config_1.default.error(err.message);
    res.status(err.statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map