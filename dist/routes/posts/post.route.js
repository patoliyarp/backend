"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("../../controller/posts/post.controller");
// import { validateData } from "../../middleware/validation.middleware";
// import { postSchema } from "../../schema/postSchema";
const expressValidate_1 = require("../../schema/expressValidate");
const expressValidater_middleware_1 = require("../../middleware/expressValidater.middleware");
const router = express_1.default.Router();
//Get routes
router.get("/", post_controller_1.getPost);
router.get("/all", post_controller_1.getAllPost);
router.get("/getheavypost", post_controller_1.getHeavyPost);
//Post routes
router.post("/", expressValidate_1.postValidationRules, expressValidater_middleware_1.expressValidation, post_controller_1.addPost);
router.patch("/:id", post_controller_1.updatePost);
router.delete("/:id", post_controller_1.deletePost);
// router.post("/addpost", validateData(postSchema), addPost);
exports.default = router;
//# sourceMappingURL=post.route.js.map