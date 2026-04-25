"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const like_controller_1 = require("../../controller/likes/like.controller");
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.authMiddleware);
router.use("/reaction", like_controller_1.reactToPost);
exports.default = router;
//# sourceMappingURL=likes.route.js.map