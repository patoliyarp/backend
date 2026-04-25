"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = void 0;
const ApiError_1 = require("../utils/ApiError");
const validateData = (schema) => {
    return (req, res, next) => {
        try {
            const validationResult = schema.safeParse(req.body);
            if (!validationResult.success) {
                return next(new ApiError_1.ApiError(`${validationResult.error.issues[0].message}`, 400));
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validateData = validateData;
//# sourceMappingURL=validation.middleware.js.map