import express from "express";
import {
  addPost,
  deletePost,
  getAllPost,
  getPost,
  updatePost,
} from "../../controller/posts/post.controller";
import { validateData } from "../../middleware/validation.middleware";
import { postSchema } from "../../schema/postSchema";
const router = express.Router();

router.get("/", getPost);
router.get("/getall", getAllPost);
router.post("/addpost", validateData(postSchema), addPost);
router.patch("/updatepost/:id", updatePost);
router.delete("/deletepost/:id", deletePost);
export default router;
