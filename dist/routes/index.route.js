"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const posts_route_1 = __importDefault(require("./posts/posts.route"));
const post_route_1 = __importDefault(require("./posts/post.route"));
const user_route_1 = __importDefault(require("./user/user.route"));
const stream_route_1 = __importDefault(require("./stream/stream.route"));
const likes_route_1 = __importDefault(require("./likes/likes.route"));
const express_1 = __importDefault(require("express"));
const mainRouter = express_1.default.Router();
//User route
mainRouter.use("/api/v1/users", user_route_1.default);
//Posts routes
mainRouter.use("/api/v1/posts", post_route_1.default);
mainRouter.use("/api/v2/posts", posts_route_1.default);
//Stream route
mainRouter.use("/api/v1/stream", stream_route_1.default);
//like route
mainRouter.use("/api/v1", likes_route_1.default);
exports.default = mainRouter;
//# sourceMappingURL=index.route.js.map