"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userSchema = zod_1.default.object({
    username: zod_1.default
        .string({ message: "username must required and string" })
        .min(4, { message: "Username must be at least 4 characters long." })
        .max(20, { message: "Username cannot exceed 20 characters." })
        .lowercase()
        .trim(),
    email: zod_1.default.email({ message: "Email is required and must be correct" }),
    password: zod_1.default
        .string({ message: "Password must be required with proper format" })
        .min(8, { message: "Password must be at least 8 characters long" }),
    mobile: zod_1.default.string("mobile must be in valid format").optional(),
}, { message: "all fields must be required" });
//# sourceMappingURL=userSchema.js.map