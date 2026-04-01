import express from "express";
import {
  getUser,
  resendEmail,
  signin,
  signout,
  signup,
  verifyEmail,
} from "../../controller/user/user.controller";
import { validateData } from "../../middleware/validation.middleware";
import { userSchema } from "../../schema/userSchema";
import { authMiddleware } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/multer.middleware";
import { imageValidateMiddleware } from "../../middleware/imageValidation.middleware";

const router = express.Router();

//Public route
router.get("/", getUser);
router.post(
  "/signup",
  upload.single("avatar"),
  imageValidateMiddleware,
  validateData(userSchema),
  signup,
);
router.post("/signin", signin);
router.get("/verifyemail/:token", verifyEmail);
router.post("/resnedemail", resendEmail);
//Protected route
router.get("/signout", authMiddleware, signout);

export default router;
