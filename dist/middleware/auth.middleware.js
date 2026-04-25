"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = require("../utils/ApiError");
const authMiddleware = async (req, res, next) => {
    try {
        //Get token from user request
        const token = req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return next(new ApiError_1.ApiError("User is unauthorize", 401));
        }
        const JWT_SECRET = process.env.JWT_SECRET || "";
        const decode = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        //Decode user info from jwt token
        const decodeUser = {
            id: decode.id,
            email: decode.email,
            role: decode.role,
        };
        if (!decode) {
            return next(new ApiError_1.ApiError("login is expired please login again", 403));
        }
        //Attach user to request object
        req.user = decodeUser;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map