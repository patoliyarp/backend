"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const posts_controller_1 = require("../../controller/posts/posts.controller");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const postsSchema_1 = require("../../schema/postsSchema");
const auth_middleware_1 = require("../../middleware/auth.middleware");
// import { authRoleMiddleware } from "../../middleware/authRole.middleware";
const router = express_1.default.Router();
//Get route
router.get("/", posts_controller_1.getPosts);
//Post route
router.use(auth_middleware_1.authMiddleware);
router.post("/", (0, validation_middleware_1.validateData)(postsSchema_1.postsSchema), posts_controller_1.addPosts);
//Patch route
router.patch("/:id", posts_controller_1.updatePosts);
//Delete route
router.delete("/:id", posts_controller_1.deletePosts);
exports.default = router;
//# sourceMappingURL=posts.route.js.map