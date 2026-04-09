import express from "express";
import {
  addPost,
  deletePost,
  getAllPost,
  getHeavyPost,
  getPost,
  updatePost,
} from "../../controller/posts/post.controller";
// import { validateData } from "../../middleware/validation.middleware";
// import { postSchema } from "../../schema/postSchema";
import { postValidationRules } from "../../schema/expressValidate";
import { expressValidation } from "../../middleware/expressValidater.middleware";
const router = express.Router();

//Get routes
router.get("/", getPost);
router.get("/all", getAllPost);
router.get("/getheavypost", getHeavyPost);

//Post routes
router.post("/", postValidationRules, expressValidation, addPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);
// router.post("/addpost", validateData(postSchema), addPost);

export default router;
