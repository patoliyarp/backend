import express from "express";
import { getPost } from "../../controller/posts/post.controller";

const router = express.Router();

router.get("/", getPost);

export default router;
