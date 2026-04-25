"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageValidateMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
const imageValidateMiddleware = (req, res, next) => {
    const image = req.file?.buffer;
    if (!image) {
        return next();
    }
    else {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimeType = fileTypes.test(req.file?.mimetype.split("/")[1] || "");
        const imageSize = (req.file?.size && Number((req.file?.size / 1024 ** 2).toFixed(2))) || 0;
        if (!mimeType) {
            const err = new ApiError_1.ApiError("Image format must be *jpeg , jpg , png , gif ", 400);
            return next(err);
        }
        if (imageSize > 1) {
            const err = new ApiError_1.ApiError("Image size must be less than 1MB", 400);
            return next(err);
        }
        next();
    }
};
exports.imageValidateMiddleware = imageValidateMiddleware;
//# sourceMappingURL=imageValidation.middleware.js.map