"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const like = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    postId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Post",
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDislike: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.LikeModel = mongoose_1.default.model("LikeModel", like);
//# sourceMappingURL=like.models.js.map