"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.postsSchema = zod_1.default.object({
    title: zod_1.default.string().min(5, "title must be at least 5 character long"),
    body: zod_1.default.string().min(10, "content must be 10 character long"),
    tags: zod_1.default.array(zod_1.default.string()).optional(),
    reactions: zod_1.default
        .object({
        likes: zod_1.default.number().nonnegative().optional(),
        dislikes: zod_1.default.number().nonnegative().optional(),
    })
        .optional(),
    views: zod_1.default.number().int().optional(),
    userId: zod_1.default.string().optional(),
});
//# sourceMappingURL=postsSchema.js.map