import { body } from "express-validator";

export const postValidationRules = [
  body("id")
    .exists({ checkFalsy: true })
    .withMessage("id is required and must be number")
    .isInt({ gt: 0 })
    .withMessage("id must be a positive integer"),

  body("title")
    .isString()
    .withMessage("title must be a string")
    .isLength({ min: 5 })
    .withMessage("title must be at least 5 character long")
    .trim(),

  body("body")
    .isString()
    .withMessage("body must be a string")
    .isLength({ min: 10 })
    .withMessage("content must be 10 character long")
    .trim(),

  body("tags").optional().isArray().withMessage("tags must be an array"),

  body("tags.*").isString().withMessage("each tag must be a string"),

  body("reactions")
    .optional()
    .isObject()
    .withMessage("reactions must be an object"),

  body("reactions.likes")
    .optional()
    .isInt({ min: 0 })
    .withMessage("likes must be a non-negative integer"),

  body("reactions.dislikes")
    .optional()
    .isInt({ min: 0 })
    .withMessage("dislikes must be a non-negative integer"),

  body("views").optional().isInt().withMessage("views must be an integer"),

  body("userId")
    .exists()
    .withMessage("userId is required")
    .isInt()
    .withMessage("userId must be an integer"),
];
