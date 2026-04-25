"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidationRules = void 0;
const express_validator_1 = require("express-validator");
exports.postValidationRules = [
    (0, express_validator_1.body)("id")
        .exists({ checkFalsy: true })
        .withMessage("id is required and must be number")
        .isInt({ gt: 0 })
        .withMessage("id must be a positive integer"),
    (0, express_validator_1.body)("title")
        .isString()
        .withMessage("title must be a string")
        .isLength({ min: 5 })
        .withMessage("title must be at least 5 character long")
        .trim(),
    (0, express_validator_1.body)("body")
        .isString()
        .withMessage("body must be a string")
        .isLength({ min: 10 })
        .withMessage("content must be 10 character long")
        .trim(),
    (0, express_validator_1.body)("tags").optional().isArray().withMessage("tags must be an array"),
    (0, express_validator_1.body)("tags.*").isString().withMessage("each tag must be a string"),
    (0, express_validator_1.body)("reactions")
        .optional()
        .isObject()
        .withMessage("reactions must be an object"),
    (0, express_validator_1.body)("reactions.likes")
        .optional()
        .isInt({ min: 0 })
        .withMessage("likes must be a non-negative integer"),
    (0, express_validator_1.body)("reactions.dislikes")
        .optional()
        .isInt({ min: 0 })
        .withMessage("dislikes must be a non-negative integer"),
    (0, express_validator_1.body)("views").optional().isInt().withMessage("views must be an integer"),
    (0, express_validator_1.body)("userId")
        .exists()
        .withMessage("userId is required")
        .isInt()
        .withMessage("userId must be an integer"),
];
//# sourceMappingURL=expressValidate.js.map