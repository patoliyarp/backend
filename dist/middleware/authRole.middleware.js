"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoleMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
const authRoleMiddleware = (...allowedRole) => {
    return (req, res, next) => {
        try {
            const role = req.user?.role;
            if (!role || !allowedRole.includes(role)) {
                return next(new ApiError_1.ApiError("Access denied ,you don't have permission to access ", 403));
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authRoleMiddleware = authRoleMiddleware;
//# sourceMappingURL=authRole.middleware.js.map