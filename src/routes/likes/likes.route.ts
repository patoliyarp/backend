import {
  reactToPost,
  reactToPosts,
} from "../../controller/likes/like.controller";
import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();
router.use(authMiddleware);

router.use("/reaction", reactToPost);
export default router;
