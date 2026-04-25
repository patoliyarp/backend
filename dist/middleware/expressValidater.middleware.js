"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressValidation = void 0;
const express_validator_1 = require("express-validator");
const ApiError_1 = require("../utils/ApiError");
const expressValidation = (req, res, next) => {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return next(new ApiError_1.ApiError(`${error.array().map((err) => err.msg)}`, 400));
    }
    next();
};
exports.expressValidation = expressValidation;
//# sourceMappingURL=expressValidater.middleware.js.map