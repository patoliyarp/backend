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
import { authRoleMiddleware } from "../../middleware/authRole.middleware";

const router = express.Router();

//Get route
router.get("/all/:page", getPosts);

//Post route
router.post("/", validateData(postsSchema), addPosts);

router.use(authMiddleware, authRoleMiddleware("admin"));
//Patch route
router.patch("/:id", updatePosts);

//Delete route
router.delete("/:id", deletePosts);

export default router;
