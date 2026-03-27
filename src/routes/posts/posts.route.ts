import express from "express";
import {
  addPosts,
  deletePosts,
  getPosts,
  updatePosts,
} from "../../controller/posts/posts.controller";
import { validateData } from "../../middleware/validation.middleware";
import { postsSchema } from "../../schema/postsSchema";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

//Public route
router.get("/getall", getPosts);
router.post("/addpost", validateData(postsSchema), addPosts);

//Protected route
router.use(authMiddleware);
router.patch("/updatepost/:id", updatePosts);
router.delete("/deletepost/:id", deletePosts);
export default router;
