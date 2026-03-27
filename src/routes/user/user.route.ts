import express from "express";
import {
  getUser,
  signin,
  signout,
  signup,
} from "../../controller/user/user.controller";
import { validateData } from "../../middleware/validation.middleware";
import { userSchema } from "../../schema/userSchema";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

//Public route
router.get("/", getUser);
router.post("/signup", validateData(userSchema), signup);
router.post("/signin", signin);

//Protected route
router.get("/signout", authMiddleware, signout);

export default router;
