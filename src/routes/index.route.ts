import postsRoute from "./posts/posts.route";
import postRoute from "./posts/post.route";
import userRoute from "./user/user.route";
import streamRoute from "./stream/stream.route";
import likesRoute from "./likes/likes.route";
import express from "express";

const mainRouter = express.Router();

//User route
mainRouter.use("/api/v1/users", userRoute);

//Posts routes
mainRouter.use("/api/v1/posts", postRoute);
mainRouter.use("/api/v2/posts", postsRoute);

//Stream route
mainRouter.use("/api/v1/stream", streamRoute);

//like route
mainRouter.use("/api/v1", likesRoute);

export default mainRouter;
