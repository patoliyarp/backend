"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = void 0;
const zod_1 = require("zod");
exports.postSchema = zod_1.z.object({
    id: zod_1.z
        .number({ message: "id is required and must be number" })
        .int()
        .positive(),
    title: zod_1.z.string().min(5, "title must be at least 5 character long"),
    body: zod_1.z.string().min(10, "content must be 10 character long"),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    reactions: zod_1.z
        .object({
        likes: zod_1.z.number().nonnegative().optional(),
        dislikes: zod_1.z.number().nonnegative().optional(),
    })
        .optional(),
    views: zod_1.z.number().int().optional(),
    userId: zod_1.z.number().int(),
});
//# sourceMappingURL=postSchema.js.map