"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../../controller/user/user.controller");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const userSchema_1 = require("../../schema/userSchema");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const multer_middleware_1 = require("../../middleware/multer.middleware");
const imageValidation_middleware_1 = require("../../middleware/imageValidation.middleware");
const router = express_1.default.Router();
//Get routes
router.get("/", user_controller_1.getUser);
router.get("/verifyemail/:token", user_controller_1.verifyEmail);
router.get("/signout", auth_middleware_1.authMiddleware, user_controller_1.signout);
//Post routes
router.post("/signup", multer_middleware_1.upload.single("avatar"), imageValidation_middleware_1.imageValidateMiddleware, (0, validation_middleware_1.validateData)(userSchema_1.userSchema), user_controller_1.signup);
router.post("/signin", user_controller_1.signin);
router.post("/resnedemail", user_controller_1.resendEmail);
exports.default = router;
//# sourceMappingURL=user.route.js.map