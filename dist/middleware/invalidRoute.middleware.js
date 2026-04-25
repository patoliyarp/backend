"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidRouteMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
const invalidRouteMiddleware = (req, res, next) => {
    const err = new ApiError_1.ApiError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(err);
};
exports.invalidRouteMiddleware = invalidRouteMiddleware;
//# sourceMappingURL=invalidRoute.middleware.js.map