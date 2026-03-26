import express from "express";
import {
  addPosts,
  deletePosts,
  getPosts,
  updatePosts,
} from "../../controller/posts/posts.controller";
import { validateData } from "../../middleware/validation.middleware";
import { postsSchema } from "../../schema/postsSchema";

const router = express.Router();

router.get("/getall", getPosts);
router.post("/addpost", validateData(postsSchema), addPosts);
router.patch("/updatepost/:id", updatePosts);
router.delete("/deletepost/:id", deletePosts);
export default router;
