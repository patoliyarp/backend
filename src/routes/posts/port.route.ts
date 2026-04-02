import express from "express";
import {
  addPost,
  deletePost,
  getAllPost,
  getHeavyPost,
  getPost,
  updatePost,
} from "../../controller/posts/post.controller";
import { validateData } from "../../middleware/validation.middleware";
import { postSchema } from "../../schema/postSchema";
import { postValidationRules } from "../../schema/expressValidate";
import { expressValidation } from "../../middleware/expressValidater.middleware";
const router = express.Router();

router.get("/", getPost);
router.get("/getall", getAllPost);
// router.post("/addpost", validateData(postSchema), addPost);
router.post("/addpost", postValidationRules, expressValidation, addPost);
router.patch("/updatepost/:id", updatePost);
router.delete("/deletepost/:id", deletePost);
router.get("/getheavypost", getHeavyPost);
export default router;
