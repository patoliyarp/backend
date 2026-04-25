"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const logger_config_1 = __importDefault(require("../config/logger.config"));
const JWT_SECRET = process.env.JWT_SECRET;
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        min: [4, "Username must be at least 4 characters long."],
        max: [20, "Username cannot exceed 20 characters."],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z][a-zA-Z0-9]{3,19}$/.test(v);
            },
            message: (prop) => `${prop.value} is not a valid username. Must start with a letter and contain only letters, numbers, or underscores.`,
        },
    },
    email: {
        type: String,
        required: [true, "Email required"],
        lowercase: true,
        unique: true,
        match: [/.+@.+\..+/, "Invalid email"],
    },
    password: {
        type: String,
        required: [true, "Password required"],
        min: 8,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    verificationTokenExpire: {
        type: Date,
    },
    mobile: {
        type: String,
    },
    avatar: {
        type: String,
    },
    image_public_id: {
        type: String,
    },
    accessToken: {
        type: String,
    },
}, { timestamps: true });
//Hash password just before save to database
userSchema.pre("save", async function () {
    if (this.isModified("password"))
        try {
            this.password = await bcryptjs_1.default.hash(this.password, 10);
        }
        catch (error) {
            // throw new Error();
            logger_config_1.default.error(error);
        }
});
//Add password compare method to userSchema
userSchema.methods.comparePassword = async function (password) {
    return await bcryptjs_1.default.compare(password, this.password);
};
//Add generateRefreshToken method to userSchema
userSchema.methods.generateRefreshToken = function () {
    return jsonwebtoken_1.default.sign({
        id: this._id,
        email: this.email,
        role: this.role,
    }, JWT_SECRET, {
        expiresIn: "7d",
    });
};
//Add verification token method
userSchema.methods.getVerificationToken = function () {
    const token = crypto_1.default.randomBytes(20).toString("hex");
    //hash the token before save
    this.verificationToken = crypto_1.default
        .createHash("sha256")
        .update(token)
        .digest("hex");
    //token expire in 30min
    this.verificationTokenExpire = Date.now() + 30 * 60 * 1000;
    return token;
};
exports.User = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=user.models.js.map